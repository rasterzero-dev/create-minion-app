import { useState } from 'react';
import { View, Text, Pressable, useSystemMetrics } from 'minion-js';

export default function Home() {
  const [count, setCount] = useState(0);
  const { safeAreaInsets } = useSystemMetrics();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#f5f6f8',
        padding: 24,
        paddingTop: safeAreaInsets.top + 24,
        gap: 20,
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: 700, color: '#19232d' }}>Minion</Text>
      <Pressable
        ripple
        onPress={() => setCount(count + 1)}
        style={{ padding: 16, borderRadius: 8, backgroundColor: '#d2efe7' }}
      >
        <Text style={{ color: '#173c32' }}>Count: {count}</Text>
      </Pressable>
    </View>
  );
}
