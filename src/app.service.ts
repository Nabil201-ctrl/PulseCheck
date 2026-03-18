import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, catchError } from 'rxjs';
import { OpenAI } from 'openai';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private openai: OpenAI | null = null;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('DEEPSEEK_API_KEY') || this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey) {
      this.openai = new OpenAI({
        apiKey,
        baseURL: 'https://api.deepseek.com/v1',
      });
    }
  }

  async checkUrl(url: string): Promise<any> {
    const startTime = Date.now();
    let response;
    let errorStatus;
    let errorHeaders;
    let isError = false;

    try {
      response = await firstValueFrom(
        this.httpService.get(url, {
          timeout: 10000,
        }).pipe(
          catchError((error) => {
            isError = true;
            if (error.response) {
              return [error.response];
            } else {
              throw error;
            }
          })
        )
      );
    } catch (error: any) {
      return {
        url,
        status: 'Failed',
        message: error.message,
        timeMs: Date.now() - startTime
      };
    }

    const endTime = Date.now();
    const timeMs = endTime - startTime;
    const status = response?.status || 500;
    const headers = response?.headers || {};

    let aiInsight: string | null = null;
    const needsAnalysis = timeMs > 500 || status >= 400;

    if (needsAnalysis && this.openai) {
      try {
        aiInsight = await this.analyzeWithAI({ status, headers, timeMs });
      } catch (err) {
        this.logger.error('OpenAI analysis failed', err);
        aiInsight = 'Analysis failed due to OpenAI error.';
      }
    }

    return {
      url,
      timeMs,
      status,
      headers: headers,
      insight: aiInsight,
    };
  }

  private async analyzeWithAI(data: { status: number, headers: any, timeMs: number }): Promise<string> {
    if (!this.openai) {
      return 'OpenAI not configured';
    }
    const prompt = `Analyze these HTTP headers and response time. Identify potential bottlenecks like missing compression, slow TTFB, or CDN misses.\n\n` +
      `Response Time: ${data.timeMs}ms\n` +
      `HTTP Status: ${data.status}\n` +
      `Headers:\n${JSON.stringify(data.headers, null, 2)}\n` +
      `Provide a brief, actionable root cause hypothesis.`;

    const completion = await this.openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are an SRE expert analyzing HTTP telemetry.' },
        { role: 'user', content: prompt }
      ],
    });

    return completion.choices[0]?.message?.content || 'No insights generated.';
  }
}
