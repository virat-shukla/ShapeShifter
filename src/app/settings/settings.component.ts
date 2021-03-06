import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { AnimatorService } from '../services/animator.service';
import { Interpolator, INTERPOLATORS } from '../scripts/animation';
import { LayerStateService, MorphabilityStatus } from '../services/layerstate.service';
import { CanvasType } from '../CanvasType';
import { SettingsService } from '../services/settings.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {
  interpolators = INTERPOLATORS;
  private startRotation_ = 0;
  private endRotation_ = 0;
  shouldDisableSettingsObservable: Observable<boolean>;

  constructor(
    private animatorService: AnimatorService,
    private layerStateService: LayerStateService,
    private settingsService: SettingsService) { }

  ngOnInit() {
    this.shouldDisableSettingsObservable = Observable.combineLatest(
      this.animatorService.getAnimatorSettingsObservable(),
      this.layerStateService.getMorphabilityStatusObservable())
      .map((value: [{ isPlaying: boolean }, MorphabilityStatus]) => {
        return value[0].isPlaying || value[1] !== MorphabilityStatus.Morphable;
      });
  }

  get selectedInterpolator() {
    return this.animatorService.getInterpolator();
  }

  set selectedInterpolator(interpolator: Interpolator) {
    this.animatorService.setInterpolator(interpolator);
  }

  get duration() {
    return this.animatorService.getDuration();
  }

  // TODO: validate this input (i.e. between min/max values)
  set duration(duration: number) {
    this.animatorService.setDuration(duration);
  }

  get startRotation() {
    return this.startRotation_;
  }

  // TODO: remove the layer if both attributes are set to 0?
  // TODO: make these the rotation gets exported as well
  set startRotation(startRotation: number) {
    this.startRotation_ = startRotation;
    this.layerStateService.updateActiveRotationLayer(CanvasType.Start, startRotation, false);
    this.layerStateService.updateActiveRotationLayer(CanvasType.Preview, startRotation, false);
    this.layerStateService.updateActiveRotationLayer(CanvasType.End, this.endRotation, false);
    this.layerStateService.notifyChange(CanvasType.Start);
    this.layerStateService.notifyChange(CanvasType.Preview);
    this.layerStateService.notifyChange(CanvasType.End);
  }

  get endRotation() {
    return this.endRotation_;
  }

  // TODO: remove the layer if both attributes are set to 0?
  // TODO: make these the rotation gets exported as well
  set endRotation(endRotation: number) {
    this.endRotation_ = endRotation;
    this.layerStateService.updateActiveRotationLayer(CanvasType.Start, this.startRotation, false);
    this.layerStateService.updateActiveRotationLayer(CanvasType.Preview, this.startRotation, false);
    this.layerStateService.updateActiveRotationLayer(CanvasType.End, endRotation, false);
    this.layerStateService.notifyChange(CanvasType.Start);
    this.layerStateService.notifyChange(CanvasType.Preview);
    this.layerStateService.notifyChange(CanvasType.End);
  }

  get shouldLabelPoints() {
    return this.settingsService.shouldLabelPoints();
  }

  set shouldLabelPoints(shouldLabelPoints: boolean) {
    this.settingsService.setShouldLabelPoints(shouldLabelPoints);
  }
}
