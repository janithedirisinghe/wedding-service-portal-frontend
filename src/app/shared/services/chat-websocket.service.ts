import { Injectable, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Client, IMessage, StompSubscription, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface RealtimeMessage<T = any> {
  destination: string;
  payload: T;
}

@Injectable({ providedIn: 'root' })
export class ChatWebsocketService {
  private client?: Client;
  private connected$ = new BehaviorSubject<boolean>(false);
  private inbound$ = new Subject<RealtimeMessage>();
  private subs: Map<string, StompSubscription> = new Map();

  private isBrowser: boolean;
  constructor(private zone: NgZone, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  isConnected(): Observable<boolean> { return this.connected$.asObservable(); }
  messages(): Observable<RealtimeMessage> { return this.inbound$.asObservable(); }

  connect(): void {
  if (!this.isBrowser) return; // avoid SSR
    if (this.client && this.client.active) return;

  // SockJS expects an http(s) URL; backend typically maps it at /ws
  const sockUrl = `${environment.apiUrl}/ws`;
  this.client = Stomp.over(() => new SockJS(sockUrl));
    this.client.reconnectDelay = 3000;
    this.client.onConnect = () => this.zone.run(() => this.connected$.next(true));
    this.client.onStompError = () => this.zone.run(() => this.connected$.next(false));
    this.client.onWebSocketClose = () => this.zone.run(() => this.connected$.next(false));
    this.client.onUnhandledMessage = (msg: IMessage) => {
      try {
        const body = JSON.parse(msg.body);
        this.zone.run(() => this.inbound$.next({ destination: msg.headers['destination'] || '', payload: body }));
      } catch {
        // ignore
      }
    };
    this.client.activate();
  }

  disconnect(): void {
  if (!this.isBrowser) return;
    if (!this.client) return;
    this.subs.forEach(s => s.unsubscribe());
    this.subs.clear();
    this.client.deactivate();
    this.client = undefined;
  }

  subscribe(destination: string, handler: (payload: any) => void): void {
  if (!this.isBrowser) return;
    if (!this.client) return;
    if (this.subs.has(destination)) return;
    const sub = this.client.subscribe(destination, (message: IMessage) => {
      try {
        const payload = JSON.parse(message.body);
        this.zone.run(() => handler(payload));
      } catch {
        // ignore
      }
    });
    this.subs.set(destination, sub);
  }

  unsubscribe(destination: string): void {
  if (!this.isBrowser) return;
    const sub = this.subs.get(destination);
    if (sub) {
      sub.unsubscribe();
      this.subs.delete(destination);
    }
  }

  send(destination: string, payload: any): void {
  if (!this.isBrowser) return;
    if (!this.client || !this.client.connected) return;
    this.client.publish({ destination, body: JSON.stringify(payload) });
  }

  // Convenience helpers for chat destinations
  joinRoom(chatRoomId: number): void {
    this.send(`/app/chat/${chatRoomId}/join`, {});
  }
  leaveRoom(chatRoomId: number): void {
    this.send(`/app/chat/${chatRoomId}/leave`, {});
  }
}
