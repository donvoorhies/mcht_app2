/**
 * YouTubeEmbed - Renders YouTube videos properly in the app
 * Extracts video IDs from URLs and uses react-native-youtube-iframe
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
