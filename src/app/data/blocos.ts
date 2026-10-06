// Estrutura fixa dos blocos e salas do Setor 4 do centro de tecnologia.
// Se um bloco ganhar ou perder uma sala no futuro, o ajuste é feito só aqui.
export const BLOCOS: Record<string, string[]> = {
  A: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  B: ['1', '2', 'Auditório'],
  C: ['1', '2', '3', '4', '5', 'Laboratório 1'],
  D: ['1', '2', 'Laboratório 2'],
  E: ['Laboratório 3', 'Laboratório 4'],
  F: ['1', '2', '3', '4', '5'],
  G: ['1', '2', '3', '4', 'Laboratório 6'],
  H: ['Lab H1', '3', '4'],
  I: Array.from({ length: 19 }, (_, i) => String(i + 1)),
};

export interface RoomRef {
  bloco: string;
  sala: string;
  id: string;
}

export function slug(s: string): string {
  return s.replace(/[^a-zA-Z0-9]+/g, '_');
}

export function roomId(bloco: string, sala: string): string {
  return `${bloco}_${slug(sala)}`;
}

export function allRoomRefs(): RoomRef[] {
  const out: RoomRef[] = [];
  for (const bloco of Object.keys(BLOCOS)) {
    for (const sala of BLOCOS[bloco]) {
      out.push({ bloco, sala, id: roomId(bloco, sala) });
    }
  }
  return out;
}
