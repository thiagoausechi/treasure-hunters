import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { GameIcon, type IconName } from "~/components/ui/game-icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

type TreasureInfo = {
  name: string;
  points: number;
  icon: IconName;
};

const treasuresInfo = {
  Bronze: [
    { name: "Moeda", points: 10, icon: "BronzeCoin" },
    { name: "Pilha Pequena", points: 20, icon: "BronzeSmallPile" },
    { name: "Pilha Grande", points: 30, icon: "BronzeLargePile" },
    { name: "Saco de Moedas", points: 40, icon: "BronzeBag" },
    { name: "Cálice", points: 50, icon: "BronzeChalice" },
    { name: "Barra", points: 60, icon: "BronzeIngot" },
  ],
  Prata: [
    { name: "Moeda", points: 15, icon: "SilverCoin" },
    { name: "Pilha Pequena", points: 25, icon: "SilverSmallPile" },
    { name: "Pilha Grande", points: 35, icon: "SilverLargePile" },
    { name: "Saco de Moedas", points: 45, icon: "SilverBag" },
    { name: "Cálice", points: 55, icon: "SilverChalice" },
    { name: "Barra", points: 65, icon: "SilverIngot" },
  ],
  Ouro: [
    { name: "Moeda", points: 20, icon: "GoldenCoin" },
    { name: "Pilha Pequena", points: 30, icon: "GoldenSmallPile" },
    { name: "Pilha Grande", points: 40, icon: "GoldenLargePile" },
    { name: "Saco de Moedas", points: 50, icon: "GoldenBag" },
    { name: "Cálice", points: 60, icon: "GoldenChalice" },
    { name: "Barra", points: 70, icon: "GoldenIngot" },
    { name: "Trevo", points: 100, icon: "GoldenClover" },
  ],
} as const satisfies Record<string, TreasureInfo[]>;

export function TreasureValuesCard() {
  const treasureTypes = Object.entries(treasuresInfo);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Tesouros</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="Bronze" className="w-full">
          {treasureTypes.map(([type, treasures]) => (
            <TabsContent key={type} value={type} className="space-y-2">
              {treasures.map(({ name, points, icon }) => (
                <div
                  key={`${type}-${name}`}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <GameIcon name={icon} />
                    {name}
                  </div>
                  <span className="font-serif text-sm">{points}</span>
                </div>
              ))}
            </TabsContent>
          ))}

          <TabsList className="mt-4 w-full">
            {treasureTypes.map(([type]) => (
              <TabsTrigger key={type} value={type}>
                {type}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
}
