<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { Activity, ShieldAlert, CheckCircle, Timer } from 'lucide-vue-next';

const url = ref('');
const result = ref(null);
const loading = ref(false);
const error = ref('');

const analyzeUrl = async () => {
  if (!url.value) return;
  loading.value = true;
  error.value = '';
  result.value = null;

  try {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const response = await axios.post(`${apiBase}/check`, { url: url.value });
    result.value = response.data;
  } catch (err) {
    error.value = "Failed to reach the monitoring service.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-900 text-white p-8 font-sans">
    <div class="max-w-3xl mx-auto">
      <header class="flex items-center gap-3 mb-12">
        <Activity class="text-blue-400 w-10 h-10" />
        <h1 class="text-3xl font-bold tracking-tight">PulseCheck <span class="text-blue-500">AI</span></h1>
      </header>

      <div class="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl mb-8">
        <label class="block text-sm font-medium text-slate-400 mb-2">Target Endpoint URL</label>
        <div class="flex gap-4">
          <input v-model="url" type="url" placeholder="https://example.com" 
            class="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
          <button @click="analyzeUrl" :disabled="loading"
            class="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 px-8 py-3 rounded-lg font-bold transition-colors">
            {{ loading ? 'Analyzing...' : 'Run Audit' }}
          </button>
        </div>
        <p v-if="error" class="text-red-400 mt-2 text-sm">{{ error }}</p>
      </div>

      <div v-if="result" class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <p class="text-slate-400 text-xs uppercase font-bold">Latency</p>
            <div class="flex items-center gap-2 mt-1">
              <Timer class="w-5 h-5 text-yellow-400" />
              <span class="text-2xl font-mono">{{ result.timeMs }}ms</span>
            </div>
          </div>
          <div class="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <p class="text-slate-400 text-xs uppercase font-bold">HTTP Status</p>
            <div class="flex items-center gap-2 mt-1">
              <CheckCircle v-if="result.status < 400" class="w-5 h-5 text-green-400" />
              <ShieldAlert v-else class="w-5 h-5 text-red-400" />
              <span class="text-2xl font-mono">{{ result.status }}</span>
            </div>
          </div>
        </div>

        <div v-if="result.insight" class="bg-blue-900/30 border border-blue-500/50 p-6 rounded-xl">
          <h3 class="text-blue-400 font-bold mb-2 flex items-center gap-2">
            <Activity class="w-4 h-4" /> AI Root Cause Hypothesis
          </h3>
          <p class="text-lg leading-relaxed text-blue-50 italic">"{{ result.insight }}"</p>
        </div>
      </div>
    </div>
  </div>
</template>