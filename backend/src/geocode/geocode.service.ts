import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from 'config/config';
import NodeGeocoder from 'node-geocoder';

@Injectable()
export class GeocodeService {
  private geocoder: NodeGeocoder.Geocoder;

  constructor(private configService: ConfigService<Config>) {
    this.geocoder = NodeGeocoder({
      provider: 'google',
      apiKey: this.configService.get('GOOGLE_APIKEY'),
    });
  }

  async geocode(entry: NodeGeocoder.Query) {
    return this.geocoder.geocode(entry);
  }
}
