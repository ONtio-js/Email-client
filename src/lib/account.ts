import axios from "axios";
import { EmailMessage, SyncResponse, SyncUpdatedResponse } from "~/type";

export class Account {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }
  private async startSync() {
    const response = await axios.post<SyncResponse>(
      "https://api.aurinko.io/v1/email/sync",
      {},
      {
        headers: { Authorization: `Bearer ${this.token}` },
        params: {
          daysWithin: 10,
          bodyType: "html",
        },
      },
    );
    return response.data;
  }
  async getUpdatedEmails({deltaToken, pageToken,}: { deltaToken?: string; pageToken?: string;}) {
    let params: Record<string, string> = {};
    if (deltaToken) params.deltaToken = deltaToken;
    if (pageToken) params.pageToken = pageToken;

    const response = await axios.get<SyncUpdatedResponse>('https://api.aurinko.io/v1/email/sync/updated', {
        headers: { Authorization: `Bearer ${this.token}` },
        params
    });

    return response.data;
  }

  async performInitialSync() {
    try {
      let synchResponse = await this.startSync();
      while (!synchResponse.ready) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        synchResponse = await this.startSync();
      }

      let storedDeltaToken: string = synchResponse.syncUpdatedToken;
      let updatedResponse = await this.getUpdatedEmails({deltaToken:storedDeltaToken});

      if(updatedResponse.nextDeltaToken){
            storedDeltaToken = updatedResponse.nextDeltaToken;
      }

      let allEmails : EmailMessage[] = updatedResponse.records;

      while(updatedResponse.nextPageToken){
          updatedResponse = await this.getUpdatedEmails({pageToken:updatedResponse.nextPageToken});
          allEmails = allEmails.concat(updatedResponse.records);

          if(updatedResponse.nextDeltaToken){
              storedDeltaToken = updatedResponse.nextDeltaToken;
          }
      }
      console.log('initial sync complete',allEmails.length);

      return {
        emails: allEmails,
        deltaToken: storedDeltaToken
      }
    } catch (error) {
       if(axios.isAxiosError(error)){
           console.error('Error fetching updated emails',error.response?.data);
    }else{
        console.error(error);
    }
    throw error;
  }
}
}
