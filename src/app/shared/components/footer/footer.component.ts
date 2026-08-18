import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  readonly instagramUrl = 'https://www.instagram.com/mkstudio.pk/';
  readonly whatsappPhone = environment.storeWhatsApp.replace(/[^\d]/g, '');
  readonly whatsappUrl = `https://wa.me/${this.whatsappPhone}`;
  readonly whatsappDisplay = this.formatWhatsAppDisplay(this.whatsappPhone);

  private formatWhatsAppDisplay(phone: string): string {
    if (phone.startsWith('92') && phone.length === 12) {
      return `+92 ${phone.slice(2, 5)} ${phone.slice(5)}`;
    }

    return `+${phone}`;
  }
}
