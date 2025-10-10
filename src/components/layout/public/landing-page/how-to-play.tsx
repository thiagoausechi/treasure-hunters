import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

const infos = [
  "Aventure-se pelo mapa em busca de tesouros. Leve-os em segurança para sua base e acumule pontos!",
  "Cuidado com a cobiça! Uma vez que você coleta um tesouro, deverá depositá-lo para pegar outro.",
  "Sua base possui espaço limitado. Gerencie seu inventário com sabedoria, escolhendo os tesouros que maximizam sua pontuação.",
  "Seja astuto! Você pode depositar tesouros na base inimiga...",
  "Para estar no ranking é necessário realizar um cadastro.",
];

export function HowToPlayCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Como Jogar</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {infos.map((info, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span className="bg-golden mt-1 inline-block size-2.5 shrink-0 rotate-45" />
              <span>{info}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
