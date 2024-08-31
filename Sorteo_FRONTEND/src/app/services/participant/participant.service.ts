import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {
  private participants: { name: string, checked: boolean,colorSequence?:string[], currentColor?: string }[] = [];

  setParticipants(participants: { name: string, checked: boolean }[]) {
    this.participants = participants;
  }

  getParticipants() {
    return this.participants;
  }

  markWinnerAsChecked(winnerName: string) {
    const participant = this.participants.find(p => p.name === winnerName);
    if (participant) {
      participant.checked = true;
    }
  }
}
