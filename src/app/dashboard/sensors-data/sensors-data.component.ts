import { Component, OnInit } from '@angular/core';
import { SensorPosition } from 'src/app/Sensor';
import { BackendService } from 'src/app/shared/backend.service';
import { SENSORS_PER_PAGE } from 'src/app/shared/constants';
import { StoreService } from 'src/app/shared/store.service';

@Component({
  selector: 'app-sensors-data',
  templateUrl: './sensors-data.component.html',
  styleUrls: ['./sensors-data.component.scss']
})
export class SensorsDataComponent implements OnInit {

  public get SensorPosition() {return SensorPosition; }

  constructor(private backendService: BackendService, public storeService: StoreService) { }

  public pages: number = 0;
  public currentPage: number = 1;

  async ngOnInit() {
    this.storeService.isLoading = true;
    await this.backendService.getSensoren();
    await this.backendService.getSensorenDaten(this.currentPage);
    this.storeService.isLoading = false;
    this.pages = Math.ceil(this.storeService.sensorenDatenTotalCount / SENSORS_PER_PAGE);
  }

  async deleteSensordata(id: number) {
    await this.backendService.deleteSensorsDaten(id, this.currentPage);
  }

  async selectPage(i: any) {
    this.storeService.isLoading = true;
    this.currentPage = i + 1;
    await this.backendService.getSensorenDaten(this.currentPage);
    this.storeService.isLoading = false;
  }
}
