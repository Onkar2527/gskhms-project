
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '@config';
import { Cashbook } from '../cashbook';

@Injectable({ providedIn: 'root' })
export class CashbookService {
  nodeApiUrl: string = "";

  constructor(private http: HttpClient ,private config: ConfigService) {
    this.nodeApiUrl = config.getNodeApiUrl()
  }

  listEntries() {
    return this.http.get<Cashbook[]>(this.nodeApiUrl + 'cashbook/list');
  }

  createEntry(entry: Cashbook) {
    return this.http.post(this.nodeApiUrl + 'cashbook/create', entry);
  }

  updateEntry(id: number, entry: Cashbook) {
    return this.http.put(this.nodeApiUrl + 'cashbook/update/' + id, entry);
  }

  deleteEntry(id: number) {
    return this.http.delete(this.nodeApiUrl + 'cashbook/delete/' + id);
  }
}
