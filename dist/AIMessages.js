"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMessage = void 0;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const anthropic = new sdk_1.default({
    apiKey: process.env.ANTHROPIC_API_KEY,
});
const generateMessage = async (Character, Todo, Event, Name) => {
    const msg = await anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 100,
        temperature: 0.7,
        system: "I have a todo app called Karma AI.\nKarma AI provides users with AI coaches.\nAnd now in this case you have to become the coach\nYou have to roleplay any famous personality/movie character/fiction character/anime character(basically anything) of user's choice\nthere'll be a event like todo added, todo completed, website visited etc\nand there'll be parallel information like todo description, no. of todos etc\nyou have to completely embody the requested character and then create a personalized motivational message in style\nof that character\nyou can use parallel info to personalize the message\nWith the message user should be convinced that the inputted character is motivating them\nAnd if requested character is controversial then revert back to a personality of helping AI\nthat will motivate the user by personalized messages.\nlike avoid to get into the characters like religious figures, controversial personalities etc\nAnd also when you do not have the necessary data to properly roleplay, then always revert back to \nhelping Ai personality\nAnd don't input any things like this:\nAs an AI language model, I am unable to roleplay religious figures. However, I can provide a motivational message in the spirit of helpfulness and encouragement:\nthis embarrasses the application\nDon't send any clarification on any thing at all\nYOu should not look like AI model\njust send a normal motivating message without any clarification on why you can't complete some request\nAnd Do not send any thing like \"Tyler durden: response\" Just say the response only\nDon't write too much content too. Just a 2-3 liner would be enough\nAlso you've to work hard towards giving a response that anybody could tell that as if requested character said it.\nAlso try to incorporate references of todo list or todos in your message to get more personalized feel\n\nAlso keep some randomness and variation in your responses",
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: `Character: ${Character}, Todo: ${JSON.stringify(Todo)}, Event: ${Event}, Name: ${Name}`,
                    },
                ],
            },
        ],
    });
    return msg.content;
};
exports.generateMessage = generateMessage;
