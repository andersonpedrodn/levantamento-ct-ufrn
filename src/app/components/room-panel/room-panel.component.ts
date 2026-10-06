import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoomRef } from '../../data/blocos';
import { ItemRegistro, LevantamentoService, SalaDoc } from '../../services/levantamento.service';

const ESTADOS = ['Bom', 'Regular', 'Ruim', 'Danificado'];
const TIPOS_ITEM = ['Computador', 'Monitor', 'Projetor', 'Notebook', 'Outros'];
const MODELOS_COMPUTADOR = [
  'Dell Optiplex',
  'Dell Mini Optiplex',
  'HP EliteDesk 800G1',
  'HP EliteDesk 800G3',
  'Hd Compaq',
  'Lenovo ThinkCentre',
  'Lenovo Mini ThinkCentre',
  'Outro',
];
const CONEXOES_PROJETOR = [
  'HDMI',
  'DP',
  'VGA',
  'Adap. VGA-HDMI',
  'Adap. DP-VGA',
  'Adap. DVI-DP',
  'WI-FI',
  'Adap. VGA-DP',
  'Outro',
];
const VERSOES_SO = ['Win11', 'Win10', 'Win7', 'Linux&Win', 'Outro'];
const SIM_NAO = ['Sim', 'Não'];
const TIPOS_ARMAZENAMENTO = ['SSD', 'HD', 'NS'];
const MODELOS_PROJETOR = ['Acer', 'Epson E20', 'Epson W28+', 'Epson 475Wi+', 'Hitachi', 'Nec', 'Outro'];

@Component({
  selector: 'app-room-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sticky top-5 bg-surface border border-line rounded-xl p-4 min-h-[220px]">
      <ng-container *ngIf="room; else empty">
        <h3 class="text-[15px] font-semibold mb-0.5">Bloco {{ room!.bloco }} — Sala {{ room!.sala }}</h3>
        <div class="text-xs text-inkSoft font-mono mb-3.5">{{ room!.id }}</div>

        <div class="flex gap-2 mb-2">
          <select [(ngModel)]="tipo" class="border border-line rounded-md px-2.5 py-1.5 text-sm w-full">
            <option *ngFor="let t of tipos" [value]="t">{{ t }}</option>
          </select>
        </div>
        <div class="flex gap-2 mb-2" *ngIf="tipo === 'Outros'">
          <input
            [(ngModel)]="nomeOutro"
            type="text"
            placeholder="Especifique o item"
            class="border border-line rounded-md px-2.5 py-1.5 text-sm w-full"
          />
        </div>
        <div class="flex gap-2 mb-2">
          <input
            [(ngModel)]="tombamento"
            type="text"
            placeholder="Número de tombamento"
            class="border border-line rounded-md px-2.5 py-1.5 text-sm w-full"
          />
        </div>

        <ng-container *ngIf="tipo === 'Computador'">
          <div class="flex gap-2 mb-2">
            <select [(ngModel)]="modelo" class="border border-line rounded-md px-2.5 py-1.5 text-sm w-full">
              <option value="" disabled>Modelo do computador</option>
              <option *ngFor="let m of modelos" [value]="m">{{ m }}</option>
            </select>
          </div>
          <div class="flex gap-2 mb-2" *ngIf="modelo === 'Outro'">
            <input
              [(ngModel)]="modeloOutro"
              type="text"
              placeholder="Especifique o modelo"
              class="border border-line rounded-md px-2.5 py-1.5 text-sm w-full"
            />
          </div>

          <div class="flex gap-2 mb-2">
            <select [(ngModel)]="conexaoProjetor" class="border border-line rounded-md px-2.5 py-1.5 text-sm w-full">
              <option value="" disabled>Conexão com o projetor</option>
              <option *ngFor="let c of conexoesProjetor" [value]="c">{{ c }}</option>
            </select>
          </div>
          <div class="flex gap-2 mb-2" *ngIf="conexaoProjetor === 'Outro'">
            <input
              [(ngModel)]="conexaoProjetorOutro"
              type="text"
              placeholder="Especifique a conexão"
              class="border border-line rounded-md px-2.5 py-1.5 text-sm w-full"
            />
          </div>

          <div class="flex gap-2 mb-2">
            <select [(ngModel)]="sistemaOperacional" class="border border-line rounded-md px-2.5 py-1.5 text-sm w-full">
              <option value="" disabled>Versão do sistema operacional</option>
              <option *ngFor="let s of versoesSO" [value]="s">{{ s }}</option>
            </select>
          </div>
          <div class="flex gap-2 mb-2" *ngIf="sistemaOperacional === 'Outro'">
            <input
              [(ngModel)]="sistemaOperacionalOutro"
              type="text"
              placeholder="Especifique o sistema operacional"
              class="border border-line rounded-md px-2.5 py-1.5 text-sm w-full"
            />
          </div>

          <div class="flex gap-2 mb-2">
            <label class="text-xs text-inkSoft flex-none w-1/2 flex items-center">Sistema de segurança atualizado?</label>
            <select [(ngModel)]="segurancaAtualizada" class="border border-line rounded-md px-2.5 py-1.5 text-sm w-1/2">
              <option *ngFor="let s of simNao" [value]="s">{{ s }}</option>
            </select>
          </div>

          <div class="flex gap-2 mb-2">
            <label class="text-xs text-inkSoft flex-none w-1/2 flex items-center">Computador com internet?</label>
            <select [(ngModel)]="internet" class="border border-line rounded-md px-2.5 py-1.5 text-sm w-1/2">
              <option *ngFor="let s of simNao" [value]="s">{{ s }}</option>
            </select>
          </div>

          <div class="flex gap-2 mb-2">
            <label class="text-xs text-inkSoft flex-none w-1/2 flex items-center">Tipo de armazenamento</label>
            <select [(ngModel)]="armazenamento" class="border border-line rounded-md px-2.5 py-1.5 text-sm w-1/2">
              <option *ngFor="let a of tiposArmazenamento" [value]="a">{{ a }}</option>
            </select>
          </div>

          <div class="flex gap-2 mb-2">
            <label class="text-xs text-inkSoft flex-none w-1/2 flex items-center">Placa de vídeo externa?</label>
            <select [(ngModel)]="placaVideoExterna" class="border border-line rounded-md px-2.5 py-1.5 text-sm w-1/2">
              <option *ngFor="let s of simNao" [value]="s">{{ s }}</option>
            </select>
          </div>
        </ng-container>

        <ng-container *ngIf="tipo === 'Monitor'">
          <div class="flex gap-2 mb-2">
            <select [(ngModel)]="conexaoProjetor" class="border border-line rounded-md px-2.5 py-1.5 text-sm w-full">
              <option value="" disabled>Tipo de conexão do monitor</option>
              <option *ngFor="let c of conexoesProjetor" [value]="c">{{ c }}</option>
            </select>
          </div>
          <div class="flex gap-2 mb-2" *ngIf="conexaoProjetor === 'Outro'">
            <input
              [(ngModel)]="conexaoProjetorOutro"
              type="text"
              placeholder="Especifique a conexão"
              class="border border-line rounded-md px-2.5 py-1.5 text-sm w-full"
            />
          </div>

          <div class="flex gap-2 mb-2">
            <label class="text-xs text-inkSoft flex-none w-1/2 flex items-center">Imagem do monitor está boa?</label>
            <select [(ngModel)]="imagemBoa" class="border border-line rounded-md px-2.5 py-1.5 text-sm w-1/2">
              <option *ngFor="let s of simNao" [value]="s">{{ s }}</option>
            </select>
          </div>
        </ng-container>

        <ng-container *ngIf="tipo === 'Projetor'">
          <div class="flex gap-2 mb-2">
            <select [(ngModel)]="modelo" class="border border-line rounded-md px-2.5 py-1.5 text-sm w-full">
              <option value="" disabled>Modelo do projetor</option>
              <option *ngFor="let m of modelosProjetor" [value]="m">{{ m }}</option>
            </select>
          </div>
          <div class="flex gap-2 mb-2" *ngIf="modelo === 'Outro'">
            <input
              [(ngModel)]="modeloOutro"
              type="text"
              placeholder="Especifique o modelo"
              class="border border-line rounded-md px-2.5 py-1.5 text-sm w-full"
            />
          </div>

          <div class="flex gap-2 mb-2">
            <label class="text-xs text-inkSoft flex-none w-1/2 flex items-center">Projetor está funcionando?</label>
            <select [(ngModel)]="funcionando" class="border border-line rounded-md px-2.5 py-1.5 text-sm w-1/2">
              <option *ngFor="let s of simNao" [value]="s">{{ s }}</option>
            </select>
          </div>

          <div class="flex gap-2 mb-2">
            <label class="text-xs text-inkSoft flex-none w-1/2 flex items-center">HDMI está funcionando?</label>
            <select [(ngModel)]="hdmiFuncionando" class="border border-line rounded-md px-2.5 py-1.5 text-sm w-1/2">
              <option *ngFor="let s of simNao" [value]="s">{{ s }}</option>
            </select>
          </div>

          <div class="flex gap-2 mb-2">
            <label class="text-xs text-inkSoft flex-none w-1/2 flex items-center">Imagem do projetor está nítida?</label>
            <select [(ngModel)]="imagemNitida" class="border border-line rounded-md px-2.5 py-1.5 text-sm w-1/2">
              <option *ngFor="let s of simNao" [value]="s">{{ s }}</option>
            </select>
          </div>
        </ng-container>
        <div class="flex gap-2 mb-2">
          <input [(ngModel)]="quantidade" type="number" min="1" class="border border-line rounded-md px-2.5 py-1.5 text-sm w-16 flex-none" />
          <select [(ngModel)]="estado" class="border border-line rounded-md px-2.5 py-1.5 text-sm w-28 flex-none">
            <option *ngFor="let e of estados" [value]="e">{{ e }}</option>
          </select>
          <input
            [(ngModel)]="obs"
            type="text"
            placeholder="Observações (opcional)"
            class="border border-line rounded-md px-2.5 py-1.5 text-sm w-full"
          />
        </div>
        <button (click)="addItem()" class="bg-ink text-white rounded-md px-3 py-2 text-sm font-semibold w-full mt-0.5 hover:opacity-90">
          Adicionar item
        </button>

        <div class="flex flex-col gap-1.5 mt-3.5">
          <div *ngIf="!doc?.items?.length" class="text-inkSoft text-sm">Nenhum item registrado ainda.</div>
          <div
            *ngFor="let it of doc?.items; let i = index"
            class="flex justify-between items-center gap-2 border border-line rounded-md px-2.5 py-1.5 text-xs"
          >
            <span>
              <strong>{{ it.nome }}</strong>{{ it.tombamento ? ' · Tomb. ' + it.tombamento : '' }} — {{ it.quantidade }}x
              <span class="text-inkSoft">({{ it.estado }}{{ it.obs ? ' · ' + it.obs : '' }})</span>
              <span *ngIf="it.nome === 'Computador'" class="text-inkSoft block">{{ it.modelo }}{{ it.conexaoProjetor ? ' · Proj: ' + it.conexaoProjetor : '' }}{{ it.sistemaOperacional ? ' · SO: ' + it.sistemaOperacional : '' }}</span>
              <span *ngIf="it.armazenamento || it.internet || it.segurancaAtualizada || it.placaVideoExterna" class="text-inkSoft block">
                {{ it.armazenamento ? 'Armaz: ' + it.armazenamento : '' }}{{ it.internet ? ' · Internet: ' + it.internet : '' }}{{ it.segurancaAtualizada ? ' · Seg. atualizada: ' + it.segurancaAtualizada : '' }}{{ it.placaVideoExterna ? ' · GPU externa: ' + it.placaVideoExterna : '' }}
              </span>
              <span *ngIf="it.nome === 'Monitor' && (it.conexaoProjetor || it.imagemBoa)" class="text-inkSoft block">
                {{ it.conexaoProjetor ? 'Conexão: ' + it.conexaoProjetor : '' }}{{ it.imagemBoa ? ' · Imagem boa: ' + it.imagemBoa : '' }}
              </span>
              <span *ngIf="it.nome === 'Projetor'" class="text-inkSoft block">
                {{ it.modelo ? it.modelo : '' }}{{ it.funcionando ? ' · Funcionando: ' + it.funcionando : '' }}{{ it.hdmiFuncionando ? ' · HDMI: ' + it.hdmiFuncionando : '' }}{{ it.imagemNitida ? ' · Imagem nítida: ' + it.imagemNitida : '' }}
              </span>
            </span>
            <button
              (click)="removeItem(i)"
              title="Remover item"
              class="text-danger text-sm font-bold w-5 h-5 flex-none flex items-center justify-center rounded hover:bg-red-50"
            >
              ×
            </button>
          </div>
        </div>

        <div class="flex items-center gap-1.5 text-xs text-inkSoft mt-2.5">
          <span
            class="w-2 h-2 rounded-full"
            [class.bg-pending]="state === 'pending'"
            [class.bg-progress]="state === 'progress'"
            [class.bg-done]="state === 'done'"
          ></span>
          {{
            state === 'done'
              ? 'Sala marcada como concluída'
              : state === 'progress'
              ? 'Em andamento — não concluída'
              : 'Ainda não iniciada'
          }}
        </div>

        <div *ngIf="doc?.iniciadoEm || doc?.concluidoEm" class="text-xs text-inkSoft mt-1 flex flex-col gap-0.5">
          <span *ngIf="doc?.iniciadoEm">Iniciado em: {{ formatDate(doc?.iniciadoEm) }}</span>
          <span *ngIf="doc?.concluida && doc?.concluidoEm">
            Concluído em: {{ formatDate(doc?.concluidoEm) }}{{ doc?.concluidoPor ? ' por ' + doc?.concluidoPor : '' }}
          </span>
        </div>

        <div class="flex gap-2 mt-3.5" *ngIf="!doc?.concluida">
          <input
            [(ngModel)]="responsavel"
            type="text"
            placeholder="Nome de quem fez o levantamento"
            class="border border-line rounded-md px-2.5 py-1.5 text-sm w-full"
          />
        </div>

        <button
          (click)="toggleDone()"
          [disabled]="!doc?.concluida && !responsavel.trim()"
          class="rounded-md px-3 py-2 text-sm font-semibold w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          [class.bg-done]="!doc?.concluida"
          [class.text-white]="!doc?.concluida"
          [class.bg-bg]="!!doc?.concluida"
          [class.border]="!!doc?.concluida"
          [class.border-line]="!!doc?.concluida"
          [class.text-inkSoft]="!!doc?.concluida"
        >
          {{ doc?.concluida ? 'Reabrir sala' : 'Marcar sala como concluída' }}
        </button>
      </ng-container>
      <ng-template #empty>
        <div class="text-inkSoft text-sm leading-relaxed">Selecione uma sala ao lado para começar o registro dos itens.</div>
      </ng-template>
    </div>
  `,
})
export class RoomPanelComponent implements OnChanges {
  @Input() room: RoomRef | null = null;
  @Input() doc: SalaDoc | undefined;
  @Input() mes = '';

  estados = ESTADOS;
  tipos = TIPOS_ITEM;
  modelos = MODELOS_COMPUTADOR;
  modelosProjetor = MODELOS_PROJETOR;
  conexoesProjetor = CONEXOES_PROJETOR;
  versoesSO = VERSOES_SO;
  simNao = SIM_NAO;
  tiposArmazenamento = TIPOS_ARMAZENAMENTO;

  tipo = TIPOS_ITEM[0];
  nomeOutro = '';
  tombamento = '';
  quantidade = 1;
  estado = ESTADOS[0];
  obs = '';

  modelo = '';
  modeloOutro = '';
  conexaoProjetor = '';
  conexaoProjetorOutro = '';
  sistemaOperacional = '';
  sistemaOperacionalOutro = '';
  segurancaAtualizada = SIM_NAO[0];
  internet = SIM_NAO[0];
  armazenamento = TIPOS_ARMAZENAMENTO[0];
  placaVideoExterna = SIM_NAO[1];

  imagemBoa = SIM_NAO[0];
  funcionando = SIM_NAO[0];
  hdmiFuncionando = SIM_NAO[0];
  imagemNitida = SIM_NAO[0];

  responsavel = '';

  constructor(private svc: LevantamentoService) {}

  ngOnChanges() {
    this.resetForm();
    this.responsavel = '';
  }

  private resetForm() {
    this.tipo = TIPOS_ITEM[0];
    this.nomeOutro = '';
    this.tombamento = '';
    this.quantidade = 1;
    this.estado = ESTADOS[0];
    this.obs = '';

    this.modelo = '';
    this.modeloOutro = '';
    this.conexaoProjetor = '';
    this.conexaoProjetorOutro = '';
    this.sistemaOperacional = '';
    this.sistemaOperacionalOutro = '';
    this.segurancaAtualizada = SIM_NAO[0];
    this.internet = SIM_NAO[0];
    this.armazenamento = TIPOS_ARMAZENAMENTO[0];
    this.placaVideoExterna = SIM_NAO[1];

    this.imagemBoa = SIM_NAO[0];
    this.funcionando = SIM_NAO[0];
    this.hdmiFuncionando = SIM_NAO[0];
    this.imagemNitida = SIM_NAO[0];
  }

  get state(): 'done' | 'progress' | 'pending' {
    if (!this.doc) return 'pending';
    if (this.doc.concluida) return 'done';
    if (this.doc.items?.length) return 'progress';
    return 'pending';
  }

  formatDate(iso?: string): string {
    return iso ? new Date(iso).toLocaleDateString('pt-BR') : '';
  }

  async addItem() {
    if (!this.room) return;
    const nome = this.tipo === 'Outros' ? this.nomeOutro.trim() : this.tipo;
    if (!nome) return;
    const item: ItemRegistro = {
      nome,
      tombamento: this.tombamento.trim() || undefined,
      quantidade: this.quantidade || 1,
      estado: this.estado,
      obs: this.obs.trim() || undefined,
    };
    if (this.tipo === 'Computador') {
      item.modelo = this.modelo === 'Outro' ? this.modeloOutro.trim() || undefined : this.modelo || undefined;
      item.conexaoProjetor =
        this.conexaoProjetor === 'Outro' ? this.conexaoProjetorOutro.trim() || undefined : this.conexaoProjetor || undefined;
      item.sistemaOperacional =
        this.sistemaOperacional === 'Outro'
          ? this.sistemaOperacionalOutro.trim() || undefined
          : this.sistemaOperacional || undefined;
      item.segurancaAtualizada = this.segurancaAtualizada;
      item.internet = this.internet;
      item.armazenamento = this.armazenamento;
      item.placaVideoExterna = this.placaVideoExterna;
    }
    if (this.tipo === 'Monitor') {
      item.conexaoProjetor =
        this.conexaoProjetor === 'Outro' ? this.conexaoProjetorOutro.trim() || undefined : this.conexaoProjetor || undefined;
      item.imagemBoa = this.imagemBoa;
    }
    if (this.tipo === 'Projetor') {
      item.modelo = this.modelo === 'Outro' ? this.modeloOutro.trim() || undefined : this.modelo || undefined;
      item.funcionando = this.funcionando;
      item.hdmiFuncionando = this.hdmiFuncionando;
      item.imagemNitida = this.imagemNitida;
    }
    await this.svc.addItem(this.room.bloco, this.room.sala, this.mes, item);
    this.resetForm();
  }

  async removeItem(idx: number) {
    if (!this.room) return;
    await this.svc.removeItem(this.room.bloco, this.room.sala, this.mes, idx);
  }

  async toggleDone() {
    if (!this.room) return;
    if (!this.doc?.concluida && !this.responsavel.trim()) return;
    await this.svc.toggleConcluida(this.room.bloco, this.room.sala, this.mes, this.responsavel.trim() || undefined);
    this.responsavel = '';
  }
}
