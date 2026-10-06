import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { allRoomRefs } from '../../data/blocos';
import { SalaDoc } from '../../services/levantamento.service';

@Component({
  selector: 'app-stats-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex gap-2.5 flex-wrap mb-4">
      <div class="bg-surface border border-line rounded-xl px-4 py-3 min-w-[110px] flex-1">
        <div class="font-mono text-xl font-semibold leading-none">{{ total }}</div>
        <div class="text-[11px] text-inkSoft mt-1 uppercase tracking-wide">Salas no setor</div>
      </div>
      <div class="bg-surface border border-line rounded-xl px-4 py-3 min-w-[110px] flex-1">
        <div class="font-mono text-xl font-semibold leading-none text-done">{{ doneCount }}</div>
        <div class="text-[11px] text-inkSoft mt-1 uppercase tracking-wide">Concluídas</div>
      </div>
      <div class="bg-surface border border-line rounded-xl px-4 py-3 min-w-[110px] flex-1">
        <div class="font-mono text-xl font-semibold leading-none text-progress">{{ progressCount }}</div>
        <div class="text-[11px] text-inkSoft mt-1 uppercase tracking-wide">Em andamento</div>
      </div>
      <div class="bg-surface border border-line rounded-xl px-4 py-3 min-w-[110px] flex-1">
        <div class="font-mono text-xl font-semibold leading-none text-inkSoft">{{ pendingCount }}</div>
        <div class="text-[11px] text-inkSoft mt-1 uppercase tracking-wide">Pendentes</div>
      </div>
    </div>
    <div class="h-[7px] rounded-md bg-pending overflow-hidden flex mb-6">
      <div class="bg-done" [style.width.%]="donePct"></div>
      <div class="bg-progress" [style.width.%]="progressPct"></div>
    </div>
  `,
})
export class StatsBarComponent {
  @Input() roomsMap: Record<string, SalaDoc> = {};

  get total() {
    return allRoomRefs().length;
  }

  private stateOf(id: string): 'done' | 'progress' | 'pending' {
    const d = this.roomsMap[id];
    if (!d) return 'pending';
    if (d.concluida) return 'done';
    if (d.items?.length) return 'progress';
    return 'pending';
  }

  get doneCount() {
    return allRoomRefs().filter((r) => this.stateOf(r.id) === 'done').length;
  }
  get progressCount() {
    return allRoomRefs().filter((r) => this.stateOf(r.id) === 'progress').length;
  }
  get pendingCount() {
    return this.total - this.doneCount - this.progressCount;
  }
  get donePct() {
    return this.total ? (this.doneCount / this.total) * 100 : 0;
  }
  get progressPct() {
    return this.total ? (this.progressCount / this.total) * 100 : 0;
  }
}
