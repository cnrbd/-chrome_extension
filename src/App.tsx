import "./App.css";
import { getCurrentTabUrl } from "./utils/getCurrentTabUrl";
import { useEffect, useState } from "react";
import { scrapeRecipePage, scrapeIngredients } from "./services/scraper";

import { Header } from "./components/Header.tsx";
import { Button } from "./components/Button.tsx";

export default function App() {
  const [currentTabUrl, setCurrentTabUrl] = useState<string>("");
  const [html, setHtml] = useState<string>("");
  const [ingredients, setIngredients] = useState<string>("");

  //async function nested in useeffect to get the current tab url
  //dependecies should have the currentTabUrl since each remount should reset the currentTabUrl
  useEffect(() => {
    const url = async () => {
      const tab = await getCurrentTabUrl();
      setCurrentTabUrl(tab?.url ?? "");
    };
    url();
  }, []);

  useEffect(() => {
    const currentTabHTML = async () => {
      const html = await scrapeRecipePage(currentTabUrl);
      setHtml(html);
    };
    currentTabHTML();
  }, [currentTabUrl]);

  useEffect(() => {
    const currentTabHTML = () => {
      const ingredientText = scrapeIngredients(html);
      setIngredients(ingredientText);
    };
    currentTabHTML();
  }, [html]);

  return (
    <div className="w-60 h-80 flex flex-col">
      <Header />
      {currentTabUrl && <p>link: {currentTabUrl}</p>}
      {/* {html && <p>html: {html}</p>} */}
      {ingredients && <p>ingredients: {ingredients}</p>}
      <Button>Calculate</Button>
    </div >
  );
}
