<script lang="ts">
  import { View, Text, Pressable, systemMetrics } from 'minion-js/svelte';

  let count = $state(0);
</script>

<View
  style={{
    flex: 1,
    backgroundColor: '#f5f6f8',
    padding: 24,
    paddingTop: $systemMetrics.safeAreaInsets.top + 24,
    gap: 20,
  }}
>
  <Text style={{ fontSize: 28, fontWeight: 700, color: '#19232d' }}>Minion</Text>
  <Pressable
    ripple
    onPress={() => count++}
    style={{ padding: 16, borderRadius: 8, backgroundColor: '#d2efe7' }}
  >
    <Text style={{ color: '#173c32' }}>Count: {count}</Text>
  </Pressable>
</View>
