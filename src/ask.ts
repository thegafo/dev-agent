import * as readline from "readline";

let rl: readline.ReadLine | null = null;

export const ask = (question: string): Promise<string> => {
  return new Promise((resolve) => {
    if (!rl) {
      rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: true,
      });
    }

    if (!question.endsWith(" ")) {
      question += " ";
    }

    rl?.question(question, (answer: string) => {
      resolve(answer);
    });
  });
};
