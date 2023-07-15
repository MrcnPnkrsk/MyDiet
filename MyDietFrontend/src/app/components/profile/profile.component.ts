import { Component, OnInit } from '@angular/core';
import { Profile } from 'src/app/models/profile.model';
import { ProfileService } from 'src/app/services/profile.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  sexes: SelectItem[] = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ];

  constructor(private fb: FormBuilder, private profileService: ProfileService, private messageService: MessageService) {
    this.profileForm = this.fb.group({
      currentAge: [''],
      sex: [''],
      weight: [''],
      height: [''],
      activityFactor: [''],
      targetWeight: [''],
      changePerMonth: [''],
      mealsPerDay: [''],
      dailyCalories: ['']
    });
  }

  ngOnInit() {
    this.profileService.getProfile().subscribe((profile) => {
      this.profileForm.patchValue(profile);
    });

    this.profileForm.valueChanges.subscribe(() => {
      this.calculateDailyCalories();
    });
  }

  calculateDailyCalories(): void {
    let profile = this.profileForm.value;
    let BMR: number;

    if (profile.sex === 'Male') {
      BMR = 10 * profile.weight + 6.25 * profile.height - 5 * profile.currentAge + 5;
    } else {
      BMR = 10 * profile.weight + 6.25 * profile.height - 5 * profile.currentAge - 161;
    }

    let TDEE = BMR * profile.activityFactor;
    let caloricAdjustment = (profile.changePerMonth * 7700) / 30;
    profile.dailyCalories = TDEE + caloricAdjustment;
    this.profileForm.controls['dailyCalories'].setValue(profile.dailyCalories);
  }

  onSubmit() {
    this.profileService.upsertProfile(this.profileForm.value).subscribe(
      () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Profile saved successfully' });
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not save profile' });
      }
    );
  }
}
