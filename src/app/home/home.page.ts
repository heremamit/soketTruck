import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';

const { Geolocation } = Plugins;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  count = 0;
  checLocation$ = new BehaviorSubject<{ lat: number; lng: number }>(null);
  geoLoation: { lat: number; lng: number };
  constructor(private socket: Socket) {
    setInterval((item) => {
      this.increseCount();
    }, 3000);
    this.checLocation$.subscribe((location: { lat: number; lng: number }) => {
      if (location) {
        this.geoLoation = location;
        let data: {
          location?: {
            lat: number;
            long: number;
          };
          driverId?: string;
        } = {
          driverId: '5ffeba36f2ecc9002831ea5f',
          location: {
            lat: this.geoLoation.lat,
            long: this.geoLoation.lng,
          },
        };
        this.socket.emit('truckInfo', data, (data) => {
          console.log(data);
        });
      }
    });
  }

  async location(): Promise<{ lat: number; lng: number }> {
    let position = await Geolocation.getCurrentPosition();

    return { lat: position.coords.latitude, lng: position.coords.longitude };
  }

  async increseCount() {
    let prevGeoLoaction: { lat: number; lng: number } = this.geoLoation;
    let currentLocation = await this.location();

    if (prevGeoLoaction) {
      if (
        !(
          prevGeoLoaction.lat === currentLocation.lat &&
          prevGeoLoaction.lng === currentLocation.lng
        )
      ) {
        this.checLocation$.next(currentLocation);
      }
    } else {
      this.checLocation$.next(currentLocation);
    }
  }
}
