import { ISalesRep } from '../ISalesRep';
import { AngularFirestoreDocument } from '@angular/fire/firestore';

export interface IAuthedSalesRep {
    localRef: ISalesRep;
    serverRef: AngularFirestoreDocument<ISalesRep>;
}