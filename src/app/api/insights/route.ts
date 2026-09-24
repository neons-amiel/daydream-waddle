import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { dreamItem, income, expenses, savings, leftover, months, expenseDetails } = body;

    // 1. Convert the expense dictionary into a readable sentence for the AI
    const formattedExpenses = expenseDetails && Object.keys(expenseDetails).length > 0 
      ? Object.entries(expenseDetails)
          .filter(([_, val]) => val !== '' && val !== '0') // Filter out empty inputs
          .map(([key, val]) => `${key}: ₱${val}`)
          .join(', ') 
      : 'Not detailed';

    // 2. The optimized Noot Noot prompt with itemized visibility
    const prompt = `You are Noot Noot, a smart, realistic, and encouraging financial advisor for the app Daydream. 
    The user is saving for: ${dreamItem || 'a special item'}. 
    Monthly Income: ₱${income}
    Total Monthly Expenses: ₱${expenses}
    Itemized Expenses Breakdown: ${formattedExpenses}
    Mandatory Savings: ₱${savings}
    Left for Goal: ₱${leftover}
    Time to afford: ${months} months.
    
    Act like a real financial professional evaluating their profile:
    1. If they are over budget (Left for Goal is negative or 0), gently advise them to fix their deficit or cut expenses before buying wants.
    2. If their Mandatory Savings are less than 10% of their Monthly Income, give a light warning that saving so little leaves them vulnerable to emergencies, recommending they aim closer to 20-30%.
    3. If their savings are healthy (20% to 50%), praise their discipline, but if savings are extremely high, note that it does not have to be that high.
    4. If their expenses take up more than 80% of their income, look directly at the 'Itemized Expenses Breakdown' and call out a specific high entry (like rent, wifi, or outside food) to trim.
    5. If the item they are saving up for is an obvious non-essential (PS5, iPhone, game, etc.) and they are allotting a dangerously high amount of income to it, give appropriate gentle advice.
    
    Based on this quick audit, give ONE highly actionable, realistic tip to optimize their timeline or budget. Keep it conversational, empathetic, under 80 words, and DO NOT use any markdown formatting (no bolding, asterisks, etc.).`;

    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const insightText = response.text() || "Keep saving consistently, you're on the right track!";

    return NextResponse.json({ insight: insightText });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    if (error?.status === 429 || error?.message?.includes('429')) {
      return NextResponse.json({ 
        insight: "Noot Noot is helping a lot of people right now! Give him a few seconds and ask again." 
      });
    }

    return NextResponse.json({ insight: "Sorry, Noot Noot is sleeping right now :(" });
  }
}