import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BLOCOS, RoomRef, roomId } from '../../data/blocos';
import { SalaDoc } from '../../services/levantamento.service';

@Component({
  selector: 'app-block-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-3.5">
      <div *ngFor="let bloco of blocoKeys" class="bg-surface border border-line rounded-xl px-4 py-3.5">
        <div class="flex items-center justify-between mb-2.5">
          <h2 class="font-mono text-sm tracking-wide">Bloco {{ bloco }}</h2>
          <span class="font-mono text-[11.5px] text-inkSoft">{{ doneCount(bloco) }}/{{ BLOCOS[bloco].length }} concluídas</span>
        </div>
        <div class="flex flex-wrap gap-1.5">
          <button
            *ngFor="let sala of BLOCOS[bloco]"
            (click)="select.emit({ bloco, sala, id: roomId(bloco, sala) })"
            class="border rounded-md px-2.5 py-1.5 text-xs font-mono flex items-center gap-1.5 transition-colors hover:border-accent"
            [class.border-line]="selectedId !== roomId(bloco, sala)"
            [class.bg-bg]="selectedId !== roomId(bloco, sala)"
            [class.border-accent]="selectedId === roomId(bloco, sala)"
            [class.bg-blue-50]="selectedId === roomId(bloco, sala)"
          >
            <span
              class="w-1.5 h-1.5 rounded-full"
              [class.bg-pending]="stateOf(roomId(bloco, sala)) === 'pending'"
              [class.bg-progress]="stateOf(roomId(bloco, sala)) === 'progress'"
              [class.bg-done]="stateOf(roomId(bloco, sala)) === 'done'"
            ></span>
            {{ sala }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class BlockMapComponent {
  @Input() roomsMap: Record<string, SalaDoc> = {};
  @Input() selectedId: string | null = null;
  @Output() select = new EventEmitter<RoomRef>();

  BLOCOS = BLOCOS;
  blocoKeys = Object.keys(BLOCOS);
  roomId = roomId;

  stateOf(id: string): 'done' | 'progress' | 'pending' {
    const d = this.roomsMap[id];
    if (!d) return 'pending';
    if (d.concluida) return 'done';
    if (d.items?.length) return 'progress';
    return 'pending';
  }

  doneCount(bloco: string) {
    return this.BLOCOS[bloco].filter((sala) => this.stateOf(roomId(bloco, sala)) === 'done').length;
  }
}
