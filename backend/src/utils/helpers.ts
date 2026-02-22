/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Utilitários de formatação
 */

export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
}

export function generateTimeSlots(start: string = '09:00', end: string = '18:00', intervalMinutes: number = 30): string[] {
  const slots: string[] = [];
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  
  let currentMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  while (currentMinutes < endMinutes) {
    const hours = Math.floor(currentMinutes / 60);
    const mins = currentMinutes % 60;
    slots.push(`${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`);
    currentMinutes += intervalMinutes;
  }

  return slots;
}

export function buildWhatsAppMessage(
  template: string,
  data: {
    nome: string;
    servico: string;
    data: string;
    horario: string;
    telefone: string;
    preco?: string;
  }
): string {
  return template
    .replace(/{nome}/g, data.nome)
    .replace(/{servico}/g, data.servico)
    .replace(/{data}/g, data.data)
    .replace(/{horario}/g, data.horario)
    .replace(/{telefone}/g, data.telefone)
    .replace(/{preco}/g, data.preco || '');
}
