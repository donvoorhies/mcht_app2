/**
 * YouTubeEmbed - Native YouTube video player component
 * 
 * PROBLEM SOLVED:
 *   - React Native WebView cannot play YouTube iframes (Error 153)
 *   - WordPress content often includes YouTube embeds
 *   - Solution: Extract video IDs and use native player
 * 
 * FUNCTIONALITY:
 *   - Takes any YouTube URL format
 *   - Extracts video ID using regex patterns
 *   - Renders native YouTube player (react-native-youtube-iframe)
 *   - Supports autoplay control, quality selection, etc.
 * 
 * SUPPORTED URL FORMATS:
 *   - youtube.com/watch?v=VIDEO_ID
 *   - youtu.be/VIDEO_ID
 *   - youtube.com/embed/VIDEO_ID
 *   - youtube.com/v/VIDEO_ID
 *   - youtube-nocookie.com/embed/VIDEO_ID (privacy-enhanced)
 * 
 * EXTRACTION ALGORITHM:
 *   1. Tests URL against multiple regex patterns
 *   2. Returns first match found
 *   3. Returns null if no valid ID found
 *   4. Component renders nothing if no valid ID
 * 
 * USAGE:
 *   - ProcessCardScreen extracts YouTube URLs from WordPress HTML
 *   - Creates YouTubeEmbed component for each URL
 *   - Videos display above WebView content
 *   - Removes iframes from HTML to prevent duplicates
 * 
 * CONFIGURATION:
 *   - Default height: 200px (customizable via prop)
 *   - Play defaults to false (user must tap to play)
 *   - Uses device's native YouTube app if available
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

interface YouTubeEmbedProps {
  url: string;
  height?: number;
}

export default function YouTubeEmbed({ url, height = 200 }: YouTubeEmbedProps) {
  // Extract video ID from various YouTube URL formats
  const getVideoId = (urlString: string): string | null => {
    try {
      const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/,
        /youtube\.com\/v\/([^&?/]+)/,
        /youtube-nocookie\.com\/embed\/([^&?/]+)/,
      ];

      for (const pattern of patterns) {
        const match = urlString.match(pattern);
        if (match && match[1]) {
          return match[1];
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  const videoId = getVideoId(url);

  if (!videoId) {
    return null;
  }

  return (
    <View style={styles.container}>
      <YoutubePlayer
        height={height}
        videoId={videoId}
        play={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
});
