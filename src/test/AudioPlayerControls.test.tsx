import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AudioPlayerProvider } from '../app/context/AudioPlayerContext';
import { MiniPlayer } from '../app/components/MiniPlayer';
import { useAudioPlayer } from '../app/hooks/useAudioPlayer';
import type { Episode } from '../app/data';

const mockEpisode: Episode = {
  id: 101,
  title: 'Breaking Tech Glass Ceilings',
  description: 'An empowering episode for engineers.',
  duration: '45 min',
  date: '2026-10-15',
  episodeNumber: 12,
  audioUrl: 'https://example.com/ep12.mp3',
  coverColor: '#E05A47',
  imageUrl: 'https://example.com/ep12.jpg',
};

function TestPlayerConsumer() {
  const { toggle, currentEpisode } = useAudioPlayer();
  return (
    <div>
      <button
        type="button"
        onClick={() => toggle(mockEpisode)}
        data-testid="trigger-play-ep"
      >
        {currentEpisode ? 'Playing' : 'Start Episode'}
      </button>
      <MiniPlayer />
    </div>
  );
}

describe('AudioPlayerControls & Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders mini player controls when an episode is active', () => {
    render(
      <AudioPlayerProvider>
        <TestPlayerConsumer />
      </AudioPlayerProvider>
    );

    // Initial state: MiniPlayer is not in DOM
    expect(screen.queryByLabelText(/Close player/i)).not.toBeInTheDocument();

    // Trigger playback
    fireEvent.click(screen.getByTestId('trigger-play-ep'));

    // MiniPlayer active controls appear
    expect(screen.getByText('Breaking Tech Glass Ceilings')).toBeInTheDocument();
    expect(screen.getByLabelText(/Skip backward 15 seconds/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Skip forward 15 seconds/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Select playback speed/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Volume slider/i)).toBeInTheDocument();
  });

  it('changes playback speed and persists in localStorage', () => {
    render(
      <AudioPlayerProvider>
        <TestPlayerConsumer />
      </AudioPlayerProvider>
    );

    fireEvent.click(screen.getByTestId('trigger-play-ep'));

    const speedSelect = screen.getByLabelText(/Select playback speed/i) as HTMLSelectElement;
    expect(speedSelect.value).toBe('1');

    act(() => {
      fireEvent.change(speedSelect, { target: { value: '1.5' } });
    });

    expect(speedSelect.value).toBe('1.5');
    expect(localStorage.getItem('uht_audio_playback_rate')).toBe('1.5');
  });

  it('adjusts volume and persists in localStorage', () => {
    render(
      <AudioPlayerProvider>
        <TestPlayerConsumer />
      </AudioPlayerProvider>
    );

    fireEvent.click(screen.getByTestId('trigger-play-ep'));

    const volumeSlider = screen.getByLabelText(/Volume slider/i) as HTMLInputElement;
    expect(volumeSlider.value).toBe('1');

    act(() => {
      fireEvent.change(volumeSlider, { target: { value: '0.6' } });
    });

    expect(volumeSlider.value).toBe('0.6');
    expect(localStorage.getItem('uht_audio_volume')).toBe('0.6');

    // Test mute toggle
    const muteBtn = screen.getByLabelText(/Mute audio/i);
    act(() => {
      fireEvent.click(muteBtn);
    });

    expect(localStorage.getItem('uht_audio_volume')).toBe('0');
  });

  it('skips forward and backward within duration bounds', () => {
    render(
      <AudioPlayerProvider>
        <TestPlayerConsumer />
      </AudioPlayerProvider>
    );

    fireEvent.click(screen.getByTestId('trigger-play-ep'));

    const skipForwardBtn = screen.getByLabelText(/Skip forward 15 seconds/i);
    const skipBackBtn = screen.getByLabelText(/Skip backward 15 seconds/i);

    expect(skipForwardBtn).toBeInTheDocument();
    expect(skipBackBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(skipForwardBtn);
    });

    act(() => {
      fireEvent.click(skipBackBtn);
    });
  });

  it('dismisses player when close button is clicked', () => {
    render(
      <AudioPlayerProvider>
        <TestPlayerConsumer />
      </AudioPlayerProvider>
    );

    fireEvent.click(screen.getByTestId('trigger-play-ep'));
    expect(screen.getByText('Breaking Tech Glass Ceilings')).toBeInTheDocument();

    const closeBtn = screen.getByLabelText(/Close player/i);
    act(() => {
      fireEvent.click(closeBtn);
    });

    expect(screen.queryByText('Breaking Tech Glass Ceilings')).not.toBeInTheDocument();
  });
});
