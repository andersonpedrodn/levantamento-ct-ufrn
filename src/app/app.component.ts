import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { BLOCOS, RoomRef, roomId } from './data/blocos';
import { currentMonth, LevantamentoService, SalaDoc } from './services/levantamento.service';
import { AuthService, isEmailAllowed } from './services/auth.service';
import { StatsBarComponent } from './components/stats-bar/stats-bar.component';
import { BlockMapComponent } from './components/block-map/block-map.component';
import { RoomPanelComponent } from './components/room-panel/room-panel.component';

function formatMonth(mes: string): string {
  const [ano, m] = mes.split('-');
  const nomes = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];
  return `${nomes[Number(m) - 1]} de ${ano}`;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, StatsBarComponent, BlockMapComponent, RoomPanelComponent],
  template: `
    <div class="min-h-screen flex flex-col">
    <div class="flex-1">
    <ng-container *ngIf="authChecked; else loading">
      <ng-container *ngIf="user && isAllowed; else blocked">
        <div class="max-w-6xl mx-auto px-5 py-8">
          <header class="mb-6 flex justify-between items-start gap-4 flex-wrap">
            <div class="flex items-center gap-3">
              <img src="assets/ct-logo.png" alt="Centro de Tecnologia — Suporte de Informática" class="h-10" />
              <div>
                <h1 class="text-xl font-semibold tracking-tight">Levantamento de Itens — Setor 4</h1>
                <p class="text-sm text-inkSoft mt-1">Centro de Tecnologia · registro por sala, bloco a bloco</p>
              </div>
            </div>
            <div class="flex items-center gap-2 text-xs text-inkSoft">
              <span>{{ user!.email }}</span>
              <button (click)="logout()" class="border border-line bg-surface rounded-md px-2.5 py-1.5 hover:border-accent">
                Sair
              </button>
            </div>
          </header>

          <div class="flex justify-between items-center mb-2 gap-2 flex-wrap">
            <div class="flex items-center gap-2">
              <label class="text-sm text-inkSoft">Mês do levantamento:</label>
              <select
                [ngModel]="selectedMonth"
                (ngModelChange)="onMonthChange($event)"
                class="border border-line bg-surface rounded-lg px-2.5 py-2 text-sm font-medium"
              >
                <option *ngFor="let m of months" [value]="m">{{ formatMonth(m) }}</option>
              </select>
            </div>
            <button
              (click)="exportCsv()"
              class="border border-line bg-surface rounded-lg px-3 py-2 text-sm font-medium hover:border-accent"
            >
              Exportar CSV
            </button>
          </div>

          <app-stats-bar [roomsMap]="roomsMap"></app-stats-bar>

          <div class="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start">
            <app-block-map [roomsMap]="roomsMap" [selectedId]="selected?.id ?? null" (select)="onSelect($event)"></app-block-map>
            <app-room-panel [room]="selected" [mes]="selectedMonth" [doc]="selected ? roomsMap[selected.id] : undefined"></app-room-panel>
          </div>
        </div>
      </ng-container>

      <ng-template #blocked>
        <div class="max-w-sm mx-auto px-5 py-24 text-center">
          <img src="assets/ct-logo.png" alt="Centro de Tecnologia — Suporte de Informática" class="h-20 mx-auto mb-4" />
          <h1 class="text-lg font-semibold mb-2">Levantamento de Itens — Setor 4</h1>
          <ng-container *ngIf="!user">
            <p class="text-sm text-inkSoft mb-5">Entre com sua conta institucional para acessar o levantamento.</p>
            <button
              (click)="login()"
              class="flex items-center justify-center gap-2.5 bg-white border border-line text-ink rounded-md px-4 py-2.5 text-sm font-semibold w-full hover:border-accent shadow-sm"
            >
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.9-2.26 5.36-4.78 7.18l7.73 6c4.51-4.16 7.09-10.29 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24 24 0 0 0 0 21.56l7.98-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.9l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Entrar com Google
            </button>
          </ng-container>
          <ng-container *ngIf="user">
            <p class="text-sm text-inkSoft mb-1">
              O e-mail <strong>{{ user!.email }}</strong> não tem acesso a este sistema.
            </p>
            <p class="text-xs text-inkSoft mb-5">
              Use um e-mail &#64;ufrn.edu.br autorizado ou peça liberação ao responsável.
            </p>
            <button
              (click)="logout()"
              class="border border-line bg-surface rounded-md px-4 py-2.5 text-sm font-semibold w-full hover:border-accent"
            >
              Trocar de conta
            </button>
          </ng-container>
        </div>
      </ng-template>
    </ng-container>

    <ng-template #loading>
      <div class="max-w-sm mx-auto px-5 py-24 text-center text-sm text-inkSoft">Carregando...</div>
    </ng-template>
    </div>

    <footer class="bg-ink text-white/70 mt-10">
      <div class="max-w-6xl mx-auto px-5 py-8 flex flex-wrap gap-6 items-center justify-between">
        <div class="flex items-center gap-4">
          <img src="assets/ufrn-logo-white.png" alt="UFRN — Universidade Federal do Rio Grande do Norte" class="h-12 flex-none" />
          <div class="text-xs leading-relaxed">
            <p>Av. Senador Salgado Filho, n° 3000 — CEP 59078-900</p>
            <p>Universidade Federal do Rio Grande do Norte</p>
            <p>Campus Universitário Lagoa Nova — Centro de Tecnologia</p>
            <p>Natal — Rio Grande do Norte — Brasil</p>
          </div>
        </div>
        <div class="text-xs leading-relaxed text-right flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <p>+55 84 3342 2265</p>
        </div>
      </div>
      <div class="border-t border-white/10 px-5 py-3 text-center text-[11px] text-white/50">
        Desenvolvido por Apdn 2026
      </div>
    </footer>
    </div>
  `,
})
export class AppComponent implements OnInit, OnDestroy {
  roomsMap: Record<string, SalaDoc> = {};
  selected: RoomRef | null = null;
  selectedMonth = currentMonth();
  months: string[] = [currentMonth()];
  formatMonth = formatMonth;

  user: User | null = null;
  authChecked = false;

  private monthSub?: Subscription;
  private monthsSub?: Subscription;
  private userSub?: Subscription;
  private dataSubsStarted = false;

  constructor(private svc: LevantamentoService, private authSvc: AuthService) {}

  get isAllowed(): boolean {
    return isEmailAllowed(this.user?.email);
  }

  ngOnInit() {
    this.userSub = this.authSvc.user$.subscribe((u) => {
      this.user = u;
      this.authChecked = true;
      if (u && isEmailAllowed(u.email) && !this.dataSubsStarted) {
        this.dataSubsStarted = true;
        this.monthsSub = this.svc.watchMonths().subscribe((meses) => {
          this.months = meses;
        });
        this.subscribeMonth();
      }
    });
  }

  ngOnDestroy() {
    this.monthSub?.unsubscribe();
    this.monthsSub?.unsubscribe();
    this.userSub?.unsubscribe();
  }

  login() {
    this.authSvc.loginWithGoogle();
  }

  logout() {
    this.authSvc.logout();
  }

  private subscribeMonth() {
    this.monthSub?.unsubscribe();
    this.monthSub = this.svc.watchMonth(this.selectedMonth).subscribe((map) => {
      this.roomsMap = map;
    });
  }

  onMonthChange(mes: string) {
    this.selectedMonth = mes;
    this.selected = null;
    this.subscribeMonth();
  }

  onSelect(ref: RoomRef) {
    this.selected = ref;
  }

  exportCsv() {
    const header = [
      'Mês',
      'Bloco',
      'Sala',
      'Status da sala',
      'Iniciado em',
      'Concluído em',
      'Concluído por',
      'Item',
      'Tombamento',
      'Quantidade',
      'Estado',
      'Modelo',
      'Conexão',
      'Sistema Operacional',
      'Segurança Atualizada',
      'Internet',
      'Armazenamento',
      'Placa de Vídeo Externa',
      'Imagem Boa',
      'Funcionando',
      'HDMI Funcionando',
      'Imagem Nítida',
      'Observações',
    ];
    const rows: (string | number)[][] = [header];
    const fmtData = (iso?: string) => (iso ? new Date(iso).toLocaleDateString('pt-BR') : '');
    for (const bloco of Object.keys(BLOCOS)) {
      for (const sala of BLOCOS[bloco]) {
        const id = roomId(bloco, sala);
        const doc = this.roomsMap[id];
        const status = doc?.concluida ? 'Concluída' : doc?.items?.length ? 'Em andamento' : 'Pendente';
        const iniciado = fmtData(doc?.iniciadoEm);
        const concluido = fmtData(doc?.concluidoEm);
        const concluidoPor = doc?.concluidoPor || '';
        const salaBase = [this.selectedMonth, bloco, sala, status, iniciado, concluido, concluidoPor];
        if (doc?.items?.length) {
          for (const it of doc.items) {
            rows.push([
              ...salaBase,
              it.nome,
              it.tombamento || '',
              it.quantidade,
              it.estado,
              it.modelo || '',
              it.conexaoProjetor || '',
              it.sistemaOperacional || '',
              it.segurancaAtualizada || '',
              it.internet || '',
              it.armazenamento || '',
              it.placaVideoExterna || '',
              it.imagemBoa || '',
              it.funcionando || '',
              it.hdmiFuncionando || '',
              it.imagemNitida || '',
              it.obs || '',
            ]);
          }
        } else {
          rows.push([...salaBase, ...Array(header.length - salaBase.length).fill('')]);
        }
      }
    }
    const csv = rows
      .map((r) =>
        r
          .map((v) => {
            const s = String(v).replace(/"/g, '""');
            return /[",\n]/.test(s) ? `"${s}"` : s;
          })
          .join(',')
      )
      .join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `levantamento-setor4-${this.selectedMonth}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
