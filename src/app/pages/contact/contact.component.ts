import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  readonly instagramUrl = 'https://www.instagram.com/mkstudio.pk/';
  readonly whatsappPhone = environment.storeWhatsApp.replace(/[^\d]/g, '');
  readonly whatsappDisplay = this.formatWhatsAppDisplay(this.whatsappPhone);
  readonly whatsappChatUrl = `https://wa.me/${this.whatsappPhone}`;

  form = {
    name: '',
    phone: '',
    message: ''
  };

  fieldErrors: {
    name?: string;
    phone?: string;
    message?: string;
  } = {};
  formError = '';
  messageSent = false;
  whatsappOpened = false;
  whatsappUrl = '';

  sendOnWhatsApp(): void {
    this.formError = '';
    this.fieldErrors = {};

    if (!this.validateForm()) {
      this.formError = 'Please fix the highlighted fields and try again.';
      return;
    }

    this.whatsappUrl = this.buildWhatsAppUrl();
    this.messageSent = true;
    this.openWhatsApp();
  }

  openWhatsApp(): void {
    if (this.whatsappUrl) {
      window.open(this.whatsappUrl, '_blank');
      this.whatsappOpened = true;
    }
  }

  sendAnother(): void {
    this.form = { name: '', phone: '', message: '' };
    this.fieldErrors = {};
    this.formError = '';
    this.messageSent = false;
    this.whatsappOpened = false;
    this.whatsappUrl = '';
  }

  private validateForm(): boolean {
    let valid = true;

    if (this.form.name.trim().length < 3) {
      this.fieldErrors.name = 'Enter your name (at least 3 characters).';
      valid = false;
    }

    const phoneDigits = this.form.phone.replace(/[\s-]/g, '');
    if (!/^(03\d{9}|\+923\d{9}|923\d{9})$/.test(phoneDigits)) {
      this.fieldErrors.phone = 'Enter a valid Pakistani mobile number (03XXXXXXXXX).';
      valid = false;
    }

    if (this.form.message.trim().length < 10) {
      this.fieldErrors.message = 'Please write a short message (at least 10 characters).';
      valid = false;
    }

    return valid;
  }

  private buildWhatsAppUrl(): string {
    const message = [
      'Assalam o Alaikum MK Studio,',
      '',
      'I would like to get in touch.',
      `Name: ${this.form.name.trim()}`,
      `Phone: ${this.form.phone.trim()}`,
      '',
      this.form.message.trim()
    ].join('\n');

    return `https://wa.me/${this.whatsappPhone}?text=${encodeURIComponent(message)}`;
  }

  private formatWhatsAppDisplay(phone: string): string {
    if (phone.startsWith('92') && phone.length === 12) {
      return `+92 ${phone.slice(2, 5)} ${phone.slice(5)}`;
    }

    return `+${phone}`;
  }
}
