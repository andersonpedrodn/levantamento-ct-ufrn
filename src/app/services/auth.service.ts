import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, user } from '@angular/fire/auth';

const ALLOWED_DOMAIN = 'ufrn.edu.br';
const WHITELIST_EMAILS = ['suporte.setor4@ct.ufrn.br', 'anderson.nascimento.017@ufrn.edu.br'];

export function isEmailAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  const lower = email.toLowerCase();
  return lower.endsWith('@' + ALLOWED_DOMAIN) || WHITELIST_EMAILS.includes(lower);
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user$ = user(this.auth);

  constructor(private auth: Auth) {}

  async loginWithGoogle() {
    await signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  logout() {
    return signOut(this.auth);
  }
}
