import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { vi } from 'vitest';

import { PhotoService } from './photo.service';
import { PhotoResponse } from '../models/photo.model';

const PICSUM_API = 'https://picsum.photos/v2/list';
const MAX_DELAY_MS = 300;

const mockResponse: PhotoResponse[] = [
  { id: '0', author: 'Author A', width: 5000, height: 3333, url: 'https://unsplash.com/0', download_url: 'https://picsum.photos/id/0/5000/3333' },
  { id: '1', author: 'Author B', width: 5000, height: 3333, url: 'https://unsplash.com/1', download_url: 'https://picsum.photos/id/1/5000/3333' },
];

describe('PhotoService', () => {
  let service: PhotoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PhotoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set isLoading to true immediately on loadMore', () => {
    service.loadMore();
    expect(service.isLoading()).toBe(true);
    httpMock.expectOne((req) => req.url === PICSUM_API);
  });

  it('should not fire a second request while loading', () => {
    service.loadMore();
    service.loadMore();
    httpMock.expectOne((req) => req.url === PICSUM_API);
  });

  it('should clear error before each request', async () => {
    service.loadMore();
    httpMock.expectOne((req) => req.url === PICSUM_API)
      .flush('error', { status: 500, statusText: 'Server Error' });

    service.loadMore();
    expect(service.error()).toBeNull();
    httpMock.expectOne((req) => req.url === PICSUM_API).flush(mockResponse);
    vi.advanceTimersByTime(MAX_DELAY_MS);
    await vi.runAllTimersAsync();
  });

  it('should map PhotoResponse to Photo with correct id and url', async () => {
    service.loadMore();
    httpMock.expectOne((req) => req.url === PICSUM_API).flush(mockResponse);
    vi.advanceTimersByTime(MAX_DELAY_MS);
    await vi.runAllTimersAsync();

    expect(service.photos()[0]).toEqual({ id: 0, url: 'https://picsum.photos/id/0/400/600' });
    expect(service.photos()[1]).toEqual({ id: 1, url: 'https://picsum.photos/id/1/400/600' });
  });

  it('should set isLoading to false after successful load', async () => {
    service.loadMore();
    httpMock.expectOne((req) => req.url === PICSUM_API).flush(mockResponse);
    vi.advanceTimersByTime(MAX_DELAY_MS);
    await vi.runAllTimersAsync();

    expect(service.isLoading()).toBe(false);
  });

  it('should accumulate photos across multiple calls', async () => {
    service.loadMore();
    httpMock.expectOne((req) => req.url === PICSUM_API).flush(mockResponse);
    vi.advanceTimersByTime(MAX_DELAY_MS);
    await vi.runAllTimersAsync();

    service.loadMore();
    httpMock.expectOne((req) => req.url === PICSUM_API).flush(mockResponse);
    vi.advanceTimersByTime(MAX_DELAY_MS);
    await vi.runAllTimersAsync();

    expect(service.photos().length).toBe(4);
  });

  it('should increment page param after each successful load', async () => {
    service.loadMore();
    const req1 = httpMock.expectOne((req) => req.url === PICSUM_API);
    expect(req1.request.params.get('page')).toBe('1');
    req1.flush(mockResponse);
    vi.advanceTimersByTime(MAX_DELAY_MS);
    await vi.runAllTimersAsync();

    service.loadMore();
    const req2 = httpMock.expectOne((req) => req.url === PICSUM_API);
    expect(req2.request.params.get('page')).toBe('2');
    req2.flush(mockResponse);
    vi.advanceTimersByTime(MAX_DELAY_MS);
    await vi.runAllTimersAsync();
  });

  it('should set error signal on HTTP error', () => {
    service.loadMore();
    httpMock.expectOne((req) => req.url === PICSUM_API)
      .flush('error', { status: 500, statusText: 'Server Error' });

    expect(service.error()).not.toBeNull();
  });

  it('should set isLoading to false on HTTP error', () => {
    service.loadMore();
    httpMock.expectOne((req) => req.url === PICSUM_API)
      .flush('error', { status: 500, statusText: 'Server Error' });

    expect(service.isLoading()).toBe(false);
  });

  it('should not append photos on HTTP error', () => {
    service.loadMore();
    httpMock.expectOne((req) => req.url === PICSUM_API)
      .flush('error', { status: 500, statusText: 'Server Error' });

    expect(service.photos().length).toBe(0);
  });
});
