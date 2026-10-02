import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Loader2, PackageMinus, PackagePlus, Send } from "lucide-react";

import cuidaLogo from "@/assets/cuida-logo.png";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  buscarLoteNotificacao,
  consultarEstoqueDisponivel,
  darEntradaEstoque,
  darSaidaEstoque,
  EntradaEstoqueResposta,
  ItemNotificacao,
  listarMedicamentos,
  listarUnidades,
  LoteNotificacao,
  MedicamentoResumo,
  mensagemDeErro,
  MotivoSemAviso,
  SaidaEstoqueResposta,
  STATUS_FINAIS,
  UnidadeResumo,
} from "@/services/gestaoEstoque";

const MOTIVOS: Record<MotivoSemAviso, string> = {
  JA_HAVIA_ESTOQUE: "O medicamento já tinha estoque nesta UBS, então ninguém foi avisado de novo.",
  SEM_INTERESSADOS: "Ninguém favoritou este medicamento nesta UBS.",
  NOTIFICACAO_DESLIGADA: "A entrada foi registrada com o aviso desligado.",
  ERRO_AO_NOTIFICAR: "O estoque foi registrado, mas houve um erro ao preparar os avisos.",
  SEM_ESTOQUE: "A entrada não deixou estoque disponível.",
};

const STATUS_LOTE: Record<string, string> = {
  na_fila: "Na fila",
  processando: "Enviando",
  aguardando_janela: "Aguardando horário de envio",
  concluido: "Concluído",
  concluido_com_interrupcao: "Concluído com interrupção",
  erro: "Erro",
};

const STATUS_WHATSAPP: Record<ItemNotificacao["whatsapp"]["status"], { texto: string; variante: "default" | "secondary" | "destructive" | "outline" }> = {
  pendente: { texto: "Na fila", variante: "outline" },
  enviado: { texto: "Enviado", variante: "default" },
  falhou: { texto: "Falhou", variante: "destructive" },
  ignorado: { texto: "Não enviado", variante: "secondary" },
  nao_enviado: { texto: "Interrompido", variante: "destructive" },
};

const CODIGOS: Record<string, string> = {
  SEM_TELEFONE: "sem telefone",
  NUMERO_INVALIDO: "telefone inválido",
  DDD_INVALIDO: "DDD inválido",
  DUPLICADO: "telefone repetido",
  SEM_WHATSAPP: "número sem WhatsApp",
  INSTANCIA_DESCONECTADA: "WhatsApp desconectado",
  NAO_AUTORIZADO: "chave da Evolution errada",
  ERRO_REDE: "Evolution fora do ar",
  TIMEOUT: "sem resposta",
};

const hoje = () => new Date().toISOString().slice(0, 10);

type Modo = "entrada" | "saida";

const GestaoEstoque = () => {
  const [modo, setModo] = useState<Modo>("entrada");
  const [unidades, setUnidades] = useState<UnidadeResumo[]>([]);
  const [medicamentos, setMedicamentos] = useState<MedicamentoResumo[]>([]);
  const [erroListas, setErroListas] = useState<string | null>(null);

  const [idUnidade, setIdUnidade] = useState<string>("");
  const [idMedicamento, setIdMedicamento] = useState<string>("");
  const [quantidade, setQuantidade] = useState<string>("50");
  const [lote, setLote] = useState<string>("");
  const [vencimento, setVencimento] = useState<string>("");
  const [notificar, setNotificar] = useState<boolean>(true);

  const [estoqueAtual, setEstoqueAtual] = useState<number | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<{ titulo: string; detalhes: string[] } | null>(null);
  const [resultado, setResultado] = useState<EntradaEstoqueResposta | null>(null);
  const [loteAviso, setLoteAviso] = useState<LoteNotificacao | null>(null);
  const [resultadoSaida, setResultadoSaida] = useState<SaidaEstoqueResposta | null>(null);
  const [saidaInfo, setSaidaInfo] = useState<{ medicamento: string; unidade: string } | null>(null);

  // Listas dos selects
  useEffect(() => {
    Promise.all([listarUnidades(), listarMedicamentos()])
      .then(([u, m]) => {
        setUnidades(u);
        setMedicamentos(m);
      })
      .catch((e) => setErroListas(mensagemDeErro(e).titulo));
  }, []);

  // Estoque atual da combinação escolhida
  useEffect(() => {
    setEstoqueAtual(null);
    if (!idUnidade || !idMedicamento) return;
    consultarEstoqueDisponivel(Number(idMedicamento), Number(idUnidade))
      .then(setEstoqueAtual)
      .catch(() => setEstoqueAtual(null));
  }, [idUnidade, idMedicamento, resultado, resultadoSaida]);

  // Acompanhamento do aviso (consulta a cada 2 s até terminar)
  const idLoteAviso = resultado?.notificacao.disparada ? resultado.notificacao.id_lote_notificacao : null;
  useEffect(() => {
    if (!idLoteAviso) return;
    let ativo = true;
    let timer: ReturnType<typeof setTimeout>;
    const consultar = async () => {
      try {
        const l = await buscarLoteNotificacao(idLoteAviso);
        if (!ativo) return;
        setLoteAviso(l);
        if (!STATUS_FINAIS.includes(l.status)) timer = setTimeout(consultar, 2000);
      } catch {
        if (ativo) timer = setTimeout(consultar, 4000);
      }
    };
    consultar();
    return () => {
      ativo = false;
      clearTimeout(timer);
    };
  }, [idLoteAviso]);

  const nomeMedicamento = useMemo(
    () => medicamentos.find((m) => String(m.id_medicamento) === idMedicamento)?.nome ?? "",
    [medicamentos, idMedicamento],
  );
  const nomeUnidade = useMemo(
    () => unidades.find((u) => String(u.id) === idUnidade)?.name ?? "",
    [unidades, idUnidade],
  );

  const podeEnviar =
    !!idUnidade &&
    !!idMedicamento &&
    Number(quantidade) > 0 &&
    !enviando &&
    (modo === "saida" ? true : !!lote.trim() && !!vencimento);

  const trocarModo = (m: Modo) => {
    setModo(m);
    setErro(null);
  };

  const registrar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setErro(null);
    setResultado(null);
    setLoteAviso(null);
    setResultadoSaida(null);
    setEnviando(true);
    try {
      if (modo === "saida") {
        const r = await darSaidaEstoque({
          id_medicamento: Number(idMedicamento),
          id_unidade: Number(idUnidade),
          quantidade: Number(quantidade),
        });
        setSaidaInfo({ medicamento: nomeMedicamento, unidade: nomeUnidade });
        setResultadoSaida(r);
        return;
      }
      const r = await darEntradaEstoque({
        id_medicamento: Number(idMedicamento),
        id_unidade: Number(idUnidade),
        quantidade: Number(quantidade),
        lote: lote.trim(),
        data_vencimento: vencimento,
        notificar,
      });
      setResultado(r);
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setEnviando(false);
    }
  };

  const avisoTerminou = loteAviso ? STATUS_FINAIS.includes(loteAviso.status) : false;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={cuidaLogo} alt="CUIDA" className="w-10 h-10 rounded-lg" />
            <div>
              <h1 className="text-xl font-bold text-primary">CUIDA · Gestão</h1>
              <p className="text-xs text-muted-foreground">Entrada e saída de estoque nas UBS</p>
            </div>
          </div>
          <Button variant="ghost" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
        {/* ------------------------------------------------ Formulário */}
        <Card>
          <CardHeader>
            <div className="mb-3 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1" role="tablist">
              <Button
                type="button"
                role="tab"
                aria-selected={modo === "entrada"}
                variant={modo === "entrada" ? "default" : "ghost"}
                size="sm"
                onClick={() => trocarModo("entrada")}
              >
                <PackagePlus className="w-4 h-4 mr-1.5" /> Entrada
              </Button>
              <Button
                type="button"
                role="tab"
                aria-selected={modo === "saida"}
                variant={modo === "saida" ? "default" : "ghost"}
                size="sm"
                onClick={() => trocarModo("saida")}
              >
                <PackageMinus className="w-4 h-4 mr-1.5" /> Saída
              </Button>
            </div>
            <CardTitle className="flex items-center gap-2">
              {modo === "entrada" ? (
                <>
                  <PackagePlus className="w-5 h-5 text-primary" /> Registrar chegada de lote
                </>
              ) : (
                <>
                  <PackageMinus className="w-5 h-5 text-primary" /> Registrar saída
                </>
              )}
            </CardTitle>
            <CardDescription>
              {modo === "entrada"
                ? "Se o medicamento estava em falta nesta UBS, quem o favoritou é avisado pelo WhatsApp."
                : "Dispensação, perda ou transferência. Sai primeiro do lote que vence antes."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {erroListas && (
              <p className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                {erroListas}
              </p>
            )}
            <form onSubmit={registrar} className="space-y-4">
              <div className="space-y-2">
                <Label>Unidade de saúde</Label>
                <Select value={idUnidade} onValueChange={setIdUnidade}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha a UBS" />
                  </SelectTrigger>
                  <SelectContent>
                    {unidades.map((u) => (
                      <SelectItem key={u.id} value={String(u.id)}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Medicamento</Label>
                <Select value={idMedicamento} onValueChange={setIdMedicamento}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha o medicamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {medicamentos.map((m) => (
                      <SelectItem key={m.id_medicamento} value={String(m.id_medicamento)}>
                        {m.nome}
                        {m.concentracao ? ` · ${m.concentracao}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {estoqueAtual !== null && (
                  <p className={`text-sm ${estoqueAtual === 0 ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                    Estoque atual nesta UBS: {estoqueAtual}
                    {estoqueAtual === 0
                      ? modo === "entrada"
                        ? " (em falta: a entrada vai avisar quem favoritou)"
                        : " (em falta: não há o que dar saída)"
                      : ""}
                  </p>
                )}
              </div>

              {modo === "entrada" ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="quantidade">Quantidade</Label>
                      <Input id="quantidade" type="number" min={1} value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vencimento">Vencimento</Label>
                      <Input id="vencimento" type="date" min={hoje()} value={vencimento} onChange={(e) => setVencimento(e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lote">Código do lote</Label>
                    <Input id="lote" placeholder="ex.: ABC123" maxLength={50} value={lote} onChange={(e) => setLote(e.target.value)} />
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox id="notificar" checked={notificar} onCheckedChange={(v) => setNotificar(v === true)} />
                    <Label htmlFor="notificar" className="font-normal">
                      Avisar quem favoritou, se estava em falta
                    </Label>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="quantidade">Quantidade que saiu</Label>
                  <div className="flex gap-2">
                    <Input
                      id="quantidade"
                      type="number"
                      min={1}
                      max={estoqueAtual ?? undefined}
                      value={quantidade}
                      onChange={(e) => setQuantidade(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={!estoqueAtual}
                      onClick={() => setQuantidade(String(estoqueAtual ?? 0))}
                    >
                      Tudo{estoqueAtual ? ` (${estoqueAtual})` : ""}
                    </Button>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={!podeEnviar}>
                {enviando ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : modo === "entrada" ? (
                  <Send className="w-4 h-4 mr-2" />
                ) : (
                  <PackageMinus className="w-4 h-4 mr-2" />
                )}
                {modo === "entrada" ? "Registrar entrada" : "Registrar saída"}
              </Button>

              {erro && (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                  <p className="font-medium">{erro.titulo}</p>
                  {erro.detalhes.length > 0 && (
                    <ul className="mt-1 list-disc pl-5">
                      {erro.detalhes.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* ------------------------------------------------ Resultado */}
        <div className="space-y-6">
          {!resultado && !resultadoSaida && (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center text-muted-foreground">
                Registre uma entrada para ver o estoque atualizado e o envio dos avisos.
              </CardContent>
            </Card>
          )}

          {resultadoSaida && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> Saída registrada
                </CardTitle>
                <CardDescription>
                  {saidaInfo?.medicamento} · {saidaInfo?.unidade}
                  {resultadoSaida.baixas.length > 0 &&
                    ` · lote${resultadoSaida.baixas.length > 1 ? "s" : ""} ${resultadoSaida.baixas
                      .map((b) => `${b.lote} (−${b.quantidade})`)
                      .join(", ")}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Antes</p>
                    <p className="text-2xl font-bold">{resultadoSaida.estoque_antes}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Saída</p>
                    <p className="text-2xl font-bold">
                      −{resultadoSaida.estoque_antes - resultadoSaida.estoque_depois}
                    </p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Agora</p>
                    <p className={`text-2xl font-bold ${resultadoSaida.estoque_depois === 0 ? "text-destructive" : "text-primary"}`}>
                      {resultadoSaida.estoque_depois}
                    </p>
                  </div>
                </div>
                {resultadoSaida.estoque_depois === 0 && (
                  <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                    O medicamento ficou em falta nesta UBS. No mapa, ele aparece em "Em falta" e os cidadãos podem
                    tocar em <strong>Avise-me</strong>. Na próxima entrada, todos que pediram são avisados.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {resultado && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> Entrada registrada
                </CardTitle>
                <CardDescription>
                  {nomeMedicamento} · {nomeUnidade} · lote {resultado.entrada.lote} (vence em{" "}
                  {resultado.entrada.data_vencimento.split("-").reverse().join("/")})
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Antes</p>
                    <p className="text-2xl font-bold">{resultado.estoque_antes}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Entrada</p>
                    <p className="text-2xl font-bold">+{resultado.entrada.quantidade_adicionada}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Agora</p>
                    <p className="text-2xl font-bold text-primary">{resultado.estoque_depois}</p>
                  </div>
                </div>

                {resultado.notificacao.disparada ? (
                  <p className="rounded-md bg-primary/10 p-3 text-sm">
                    O medicamento estava em falta. Avisando{" "}
                    <strong>{resultado.notificacao.total_inscritos}</strong>{" "}
                    {resultado.notificacao.total_inscritos === 1 ? "cidadão" : "cidadãos"} que o favoritaram.
                  </p>
                ) : (
                  <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                    {("motivo" in resultado.notificacao && MOTIVOS[resultado.notificacao.motivo]) || "Nenhum aviso foi enviado."}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {resultado?.notificacao.disparada && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {!avisoTerminou && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                  Avisos por WhatsApp
                </CardTitle>
                <CardDescription>
                  {loteAviso ? STATUS_LOTE[loteAviso.status] ?? loteAviso.status : "Preparando..."}
                  {loteAviso && ` · ${loteAviso.resumo.whatsapp.enviado} de ${loteAviso.total} enviados`}
                  {" · um por vez, com intervalo entre as mensagens"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cidadão</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>WhatsApp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(loteAviso?.itens ?? []).map((item) => {
                      const st = STATUS_WHATSAPP[item.whatsapp.status];
                      return (
                        <TableRow key={item.id_cliente}>
                          <TableCell>{item.nome ?? `Cliente ${item.id_cliente}`}</TableCell>
                          <TableCell className="font-mono text-xs">{item.telefone}</TableCell>
                          <TableCell>
                            <Badge variant={st.variante}>{st.texto}</Badge>
                            {item.whatsapp.codigo && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                {CODIGOS[item.whatsapp.codigo] ?? item.whatsapp.codigo}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                {loteAviso?.motivo_interrupcao && (
                  <p className="mt-3 text-sm text-destructive">{loteAviso.motivo_interrupcao}</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default GestaoEstoque;
