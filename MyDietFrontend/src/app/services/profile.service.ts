import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Profile } from '../models/profile.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(`http://localhost:5287/api/Profile`);
  }

  upsertProfile(profile: Profile): Observable<Profile> {
    return this.http.post<Profile>('http://localhost:5287/api/Profile', profile);
  }
}