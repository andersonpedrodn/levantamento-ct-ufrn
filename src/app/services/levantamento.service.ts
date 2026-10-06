import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  getDoc,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { roomId } from '../data/blocos';

export interface ItemRegistro {
  nome: string;
  tombamento?: string;
  quantidade: number;
  estado: string;
  obs?: string;
  modelo?: string;
  conexaoProjetor?: string;
  sistemaOperacional?: string;
  segurancaAtualizada?: string;
  internet?: string;
  armazenamento?: string;
  placaVideoExterna?: string;
  imagemBoa?: string;
  funcionando?: string;
  hdmiFuncionando?: string;
  imagemNitida?: string;
}

export interface SalaDoc {
  bloco: string;
  sala: string;
  mes: string;
  items: ItemRegistro[];
  concluida: boolean;
  iniciadoEm?: string;
  concluidoEm?: string;
  concluidoPor?: string;
  atualizadoEm?: string;
}

const COLLECTION = 'levantamento-setor4';

export function currentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function monthDocId(bloco: string, sala: string, mes: string): string {
  return `${roomId(bloco, sala)}_${mes}`;
}

@Injectable({ providedIn: 'root' })
export class LevantamentoService {
  constructor(private firestore: Firestore) {}

  private ref(id: string) {
    return doc(this.firestore, COLLECTION, id);
  }

  /** Observa uma sala específica em um mês, em tempo real. */
  watchRoom(bloco: string, sala: string, mes: string): Observable<SalaDoc | undefined> {
    return docData(this.ref(monthDocId(bloco, sala, mes))) as Observable<SalaDoc | undefined>;
  }

  /** Observa todas as salas registradas em um mês, indexadas por roomId (bloco_sala). */
  watchMonth(mes: string): Observable<Record<string, SalaDoc>> {
    const col = collection(this.firestore, COLLECTION);
    const q = query(col, where('mes', '==', mes));
    return collectionData(q).pipe(
      map((docs) => {
        const out: Record<string, SalaDoc> = {};
        for (const d of docs as SalaDoc[]) {
          out[roomId(d.bloco, d.sala)] = d;
        }
        return out;
      })
    );
  }

  /** Observa a lista de meses com algum registro (mais recente primeiro), sempre incluindo o mês atual. */
  watchMonths(): Observable<string[]> {
    const col = collection(this.firestore, COLLECTION);
    return collectionData(col).pipe(
      map((docs) => {
        const meses = new Set<string>((docs as SalaDoc[]).map((d) => d.mes).filter(Boolean));
        meses.add(currentMonth());
        return Array.from(meses).sort((a, b) => (a < b ? 1 : -1));
      })
    );
  }

  private async ensure(bloco: string, sala: string, mes: string): Promise<SalaDoc> {
    const id = monthDocId(bloco, sala, mes);
    const snap = await getDoc(this.ref(id));
    if (snap.exists()) return snap.data() as SalaDoc;
    const fresh: SalaDoc = {
      bloco,
      sala,
      mes,
      items: [],
      concluida: false,
      iniciadoEm: new Date().toISOString(),
    };
    await setDoc(this.ref(id), fresh);
    return fresh;
  }

  async addItem(bloco: string, sala: string, mes: string, item: ItemRegistro) {
    const current = await this.ensure(bloco, sala, mes);
    const cleanItem = Object.fromEntries(
      Object.entries(item).filter(([, v]) => v !== undefined)
    ) as ItemRegistro;
    const items = [...current.items, cleanItem];
    await setDoc(this.ref(monthDocId(bloco, sala, mes)), {
      ...current,
      items,
      atualizadoEm: new Date().toISOString(),
    });
  }

  async removeItem(bloco: string, sala: string, mes: string, idx: number) {
    const current = await this.ensure(bloco, sala, mes);
    const items = current.items.filter((_, i) => i !== idx);
    await setDoc(this.ref(monthDocId(bloco, sala, mes)), {
      ...current,
      items,
      atualizadoEm: new Date().toISOString(),
    });
  }

  async toggleConcluida(bloco: string, sala: string, mes: string, responsavel?: string) {
    const current = await this.ensure(bloco, sala, mes);
    const concluida = !current.concluida;
    const update: SalaDoc = {
      ...current,
      concluida,
      atualizadoEm: new Date().toISOString(),
    };
    if (concluida) {
      update.concluidoEm = new Date().toISOString();
      if (responsavel) update.concluidoPor = responsavel;
    }
    const cleanUpdate = Object.fromEntries(
      Object.entries(update).filter(([, v]) => v !== undefined)
    ) as SalaDoc;
    await setDoc(this.ref(monthDocId(bloco, sala, mes)), cleanUpdate);
  }
}
