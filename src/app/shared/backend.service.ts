import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Sensor } from '../Sensor';
import { Sensorendata } from '../Sensorendata';
import { StoreService } from './store.service';
import {SENSORS_PER_PAGE} from './constants';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  sensoren: Sensor[] = [];

  constructor(private storeService: StoreService, private http: HttpClient) { }

  public async getSensoren() {
    this.sensoren = await firstValueFrom(this.http.get<Sensor[]>('http://localhost:5000/sensors'));
    this.storeService.sensoren = this.sensoren;
  }

  public async getSensorenDaten(page: number) {
    const sensorenDataResponse = await firstValueFrom(this.http.get<any>(`http://localhost:5000/sensorsData?_page=${page}&_limit=${SENSORS_PER_PAGE}`, { observe: 'response' }));
    this.storeService.sensorenDatenTotalCount = Number(sensorenDataResponse.headers.get('X-Total-Count'));
    const sensorenData: Sensorendata[]= sensorenDataResponse.body.map((data: any) => {
      const sensor: Sensor = this.sensoren.filter(sensor => sensor.id == data.sensorId)[0];
      return { ...data, sensor }
    });
    this.storeService.sensorenDaten = sensorenData;
  }

  public async addSensorsData(sensorenData: number, page:  number) {
    await firstValueFrom(this.http.post('http://localhost:5000/sensorsData', sensorenData));
    // TO DO: Richtigen Pagecount mitgeben
    await this.getSensorenDaten(page);
  }

  public async deleteSensorsDaten(sensorId: number, page: number) {
    await firstValueFrom(this.http.delete(`http://localhost:5000/sensorsData/${sensorId}`));
    // TODO: richtigen Pagecount mitgeben
    await this.getSensorenDaten(page);
  }
}
