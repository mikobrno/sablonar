/**
 * Service for handling webhook communications with n8n
 */

export interface EmailData {
  subject: string;
  body: string;
  buildingName: string;
  templateName: string;
  generatedAt?: string;
}

export interface WebhookResponse {
  success: boolean;
  message: string;
  data?: any;
}

class WebhookService {
  private webhookUrl: string;

  constructor() {
    this.webhookUrl = import.meta.env.VITE_N8N_GMAIL_WEBHOOK_URL;
    
    if (!this.webhookUrl) {
      console.warn('N8N webhook URL not configured. Gmail integration will not work.');
    }
  }

  /**
   * Send email data to n8n webhook for Gmail draft creation
   */
  async sendToGmail(emailData: EmailData): Promise<WebhookResponse> {
    if (!this.webhookUrl) {
      throw new Error('N8N webhook URL is not configured. Please check your environment variables.');
    }

    try {
      console.log('Sending email to n8n webhook:', this.webhookUrl);
      
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          subject: emailData.subject,
          body: emailData.body,
          buildingName: emailData.buildingName,
          templateName: emailData.templateName,
          generatedAt: emailData.generatedAt || new Date().toISOString(),
          timestamp: new Date().toISOString(),
          source: 'email-template-system'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      
      console.log('Webhook response:', result);

      return {
        success: true,
        message: 'E-mail byl úspěšně odeslán do Gmailu jako koncept',
        data: result
      };

    } catch (error) {
      console.error('Error sending to n8n webhook:', error);
      
      let errorMessage = 'Nepodařilo se odeslat e-mail do Gmailu';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Nepodařilo se připojit k n8n serveru. Zkontrolujte připojení k internetu.';
        } else if (error.message.includes('HTTP error')) {
          errorMessage = `Chyba serveru: ${error.message}`;
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        message: errorMessage,
        data: error
      };
    }
  }

  /**
   * Test webhook connection
   */
  async testConnection(): Promise<WebhookResponse> {
    if (!this.webhookUrl) {
      return {
        success: false,
        message: 'N8N webhook URL is not configured'
      };
    }

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          test: true,
          message: 'Connection test from email template system',
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        message: 'Webhook connection successful'
      };

    } catch (error) {
      return {
        success: false,
        message: `Webhook connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Get webhook URL for debugging
   */
  getWebhookUrl(): string {
    return this.webhookUrl || 'Not configured';
  }
}

export const webhookService = new WebhookService();