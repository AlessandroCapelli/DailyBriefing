/**
 * DailyBriefing - Tooltip didattici finanziari
 * Dizionario di spiegazioni base per utenti con zero nozioni finanziarie.
 * Ogni voce include: titolo, testo didattico con esempio pratico.
 * Uso: DBTooltips.get('PE_trailing') oppure attributo data-tip="PE_trailing"
 */
(function () {
	"use strict";

	var TIPS = {
		// ─── VALUTAZIONE ───
		prezzo: {
			t: "Prezzo",
			b: "Il prezzo e il valore a cui scambi una singola azione sul mercato in questo momento. Cambia continuamente in base a domanda e offerta: se piu persone vogliono comprare, il prezzo sale; se piu persone vogliono vendere, scende. Esempio: se il prezzo e $100 e tu compri 10 azioni, spendi $1000. Se domani il prezzo sale a $110, le tue azioni valgono $1100 (guadagno di $100, cioe +10%). Il prezzo da solo non dice se un'azione e cara o economica: serve confrontarlo con gli utili e i ricavi dell'azienda.",
		},
		market_cap: {
			t: "Market Cap (Capitalizzazione)",
			b: "La capitalizzazione di mercato e il valore totale di un'azienda in borsa, calcolato moltiplicando il prezzo di un'azione per il numero totale di azioni esistenti. E come chiedersi: 'Quanto costerebbe comprare tutta l'azienda oggi?'. Esempio: se l'azienda ha 1 miliardo di azioni e il prezzo e $100, il market cap e $100 miliardi. Serve per capire la dimensione: sopra $200 miliardi parliamo di 'large cap' (colossi come Apple, Microsoft), tra $10-200 miliardi 'mid cap', sotto $2 miliardi 'small cap' (piu rischiose ma con piu potenziale di crescita).",
		},
		enterprise_value: {
			t: "Enterprise Value (EV)",
			b: "L'Enterprise Value e il valore totale dell'azienda includendo anche il debito e sottraendo la cassa. Se vuoi comprare un'azienda, devi pagare il market cap (il valore delle azioni) ma ti prendi anche i suoi debiti da rimborsare, mentre la cassa che trovi dentro ti e in regalo. Formula semplificata: EV = Market Cap + Debito - Cassa. Esempio: market cap $100B, debito $20B, cassa $5B → EV = $115B. E una misura piu 'vera' del valore dell'azienda rispetto al solo market cap, usata spesso nel confronto con EBITDA (vedi EV/EBITDA).",
		},
		pe_trailing: {
			t: "P/E trailing (Prezzo / Utili)",
			b: "Il P/E trailing ti dice quanti anni di utili dovresti accumulare per 'ripagare' il prezzo dell'azione, basandosi sugli utili degli ultimi 12 mesi. Esempio: P/E 20 significa che paghi 20 euro per ogni euro di utile annuo che l'azienda produce. P/E basso (sotto 15) puo indicare un'azienda a sconto, ma a volte rispecchia problemi; P/E alto (sopra 30) indica aspettative di forte crescita futura ma anche rischio di delusione. Utile confrontarlo con la media del settore: un'azienda tech ha fisiologicamente P/E piu alto di un'utility.",
		},
		pe_forward: {
			t: "P/E forward (Prezzo / Utili futuri)",
			b: "Come il P/E trailing ma calcolato sugli utili attesi nei prossimi 12 mesi, stimati dagli analisti. E 'previsionale': guarda al futuro anziche al passato. Se l'azienda sta crescendo velocemente, il P/E forward sara piu basso del trailing (perche il denominatore, gli utili futuri, e piu alto). Esempio: un'azienda con P/E trailing 35 ma forward 18 e vista crescere fortissimo. Attenzione: le stime degli analisti possono sbagliare, quindi il P/E forward e piu 'speranza' che dato di fatto.",
		},
		peg: {
			t: "PEG (P/E corretto per la crescita)",
			b: "Il PEG e il P/E diviso per il tasso di crescita annuo degli utili, in percentuale. Serve a capire se un'azienda in forte crescita e davvero cara oppure e giustificata dal suo ritmo di espansione. Esempio: P/E 30 e crescita utili 20%/anno → PEG = 30/20 = 1.5. Regola di massima: PEG sotto 1 = a sconto rispetto alla crescita, vicino a 1 = prezzo equo, sopra 2 = caro anche tenendo conto della crescita attesa. E molto usato per valutare aziende growth (tech, biotech).",
		},
		pb: {
			t: "P/B (Prezzo / Valore contabile)",
			b: "Il Price-to-Book confronta il prezzo di mercato con il 'valore contabile' dell'azienda, cioe quanto varrebbero tutti i suoi asset meno i debiti se la vendessi pezzo per pezzo. Formula: prezzo azione / (patrimonio netto per azione). Esempio: P/B 3 significa che paghi 3 volte il valore contabile. Banche e industriali hanno P/B tipicamente tra 1 e 2; aziende tech e consumer brand arrivano a 10+ perche hanno asset 'intangibili' (marchio, software) non ben rappresentati in bilancio.",
		},
		ps: {
			t: "P/S (Prezzo / Ricavi)",
			b: "Il Price-to-Sales confronta il market cap con i ricavi totali degli ultimi 12 mesi. Serve quando un'azienda non ha ancora utili stabili (startup, growth company) o quando gli utili sono temporaneamente depressi. Esempio: P/S 5 = paghi 5 euro di mercato per ogni euro di fatturato annuo. MedTech e software hanno tipicamente P/S 4-10; retail e commodity 0.5-2. P/S molto alto (sopra 15) e possibile solo se l'azienda ha margini enormi o crescita esponenziale.",
		},
		ev_ebitda: {
			t: "EV/EBITDA",
			b: "Enterprise Value diviso EBITDA (utili prima di interessi, tasse, ammortamenti). E il multiplo di valutazione preferito dagli analisti perche neutralizza l'effetto del debito (usando EV) e delle politiche contabili (l'EBITDA non include ammortamenti, che sono costi 'finti' senza uscita di cassa). Esempio: EV/EBITDA 12 e considerato equo per un'azienda matura; sopra 20 indica forte crescita o valutazioni alte. E lo strumento principale nei deal M&A per decidere quanto pagare un'acquisizione.",
		},
		eps_trailing: {
			t: "EPS trailing (Utile per azione)",
			b: "L'EPS e l'utile netto dell'azienda diviso per il numero di azioni. Ti dice quanto 'guadagni teorici' produce ogni tua azione in un anno. Esempio: EPS $2 su un'azione da $40 significa che ogni anno quella azione 'genera' $2 di utile (che puo essere distribuito come dividendo o reinvestito). Il P/E si calcola proprio da qui: P/E = prezzo / EPS = 40/2 = 20. EPS in crescita costante anno su anno e il segnale principale di qualita di un'azienda.",
		},
		eps_forward: {
			t: "EPS forward (Utile per azione atteso)",
			b: "L'EPS atteso nei prossimi 12 mesi secondo gli analisti. Se l'EPS forward e molto piu alto del trailing, significa che il mercato si aspetta forte crescita. Esempio: EPS trailing $2, EPS forward $3.50 → crescita attesa 75%. Usato per calcolare il P/E forward. Cautela: le stime degli analisti sono spesso ottimistiche e vengono riviste verso il basso man mano che si avvicina la pubblicazione dei risultati.",
		},

		// ─── RANGE E MEDIE ───
		w52_high: {
			t: "Massimo a 52 settimane",
			b: "Il prezzo piu alto toccato dall'azione negli ultimi 12 mesi. E un riferimento psicologico: se il prezzo attuale e vicino al massimo, il titolo sta andando bene e potrebbe essere 'caro' rispetto al recente passato. Se invece e lontano dal massimo (es: -40%), il titolo ha avuto una fase negativa e potrebbe essere un'occasione oppure nascondere problemi veri. Esempio: prezzo $65 su massimo 52W di $100 = titolo al -35% dai massimi.",
		},
		w52_low: {
			t: "Minimo a 52 settimane",
			b: "Il prezzo piu basso toccato negli ultimi 12 mesi. Se il prezzo attuale e vicino al minimo, il titolo sta attraversando una fase difficile; gli analisti contrarian vedono i minimi 52W come potenziali zone di accumulo, se i fondamentali restano solidi. Esempio: prezzo $65 su minimo 52W di $60 = titolo appena sopra i minimi, segnale di pressione in vendita persistente.",
		},
		sma_50: {
			t: "SMA 50 (Media mobile a 50 giorni)",
			b: "La media dei prezzi di chiusura degli ultimi 50 giorni di borsa. E un indicatore di 'trend di medio termine'. Se il prezzo attuale e sopra la SMA 50 con la SMA in salita, il trend di breve-medio periodo e positivo; se e sotto e in discesa, il trend e negativo. I trader istituzionali usano la SMA 50 come supporto/resistenza dinamica: spesso il prezzo 'rimbalza' su di essa. Esempio: prezzo $65, SMA 50 $70 → sei -7% sotto la media, segnale di debolezza.",
		},
		sma_200: {
			t: "SMA 200 (Media mobile a 200 giorni)",
			b: "La media dei prezzi di chiusura degli ultimi 200 giorni, cioe circa 10 mesi di borsa. E il riferimento del trend di lungo periodo, usato da analisti tecnici e quant hedge fund. Prezzo sopra SMA 200 = mercato toro; prezzo sotto SMA 200 = mercato orso. Quando la SMA 50 taglia verso il basso la SMA 200 si parla di 'death cross', segnale bearish di lungo periodo; il contrario (SMA 50 sopra SMA 200) e 'golden cross', segnale bullish. Le SMA 200 di S&P 500, indici settoriali e big tech sono tra le linee piu osservate al mondo.",
		},
		beta: {
			t: "Beta",
			b: "Il beta misura quanto un titolo 'balla' rispetto al mercato generale (di solito S&P 500). Beta 1 = si muove come il mercato. Beta 1.5 = si muove il 50% in piu (sale di piu nei rialzi, scende di piu nei ribassi). Beta 0.5 = si muove la meta (difensivo). Beta negativo = si muove in senso opposto al mercato (rarissimo, tipico di inverse ETF o asset rifugio). Esempio: beta 0.8 tipico di utility e healthcare (stabili); beta 1.5+ tipico di tech growth e small cap (volatili). Il beta ti dice quanto rischio sistemico stai prendendo.",
		},

		// ─── PROFITTABILITA ───
		gross_margin: {
			t: "Margine lordo (Gross Margin)",
			b: "Quanto rimane dei ricavi dopo aver pagato solo i costi diretti di produzione (materie prime, manodopera di linea, costi di fabbricazione). E il primo test di qualita del business: se vendi un prodotto a 100 e produrlo ti costa 30, il margine lordo e 70%. Margine lordo alto (sopra 60%) indica potere di prezzo e prodotti differenziati. Software = 80-90% (costi marginali quasi nulli). MedTech premium = 65-75%. Retail = 20-35%. Commodity (acciaio, petrolio) = 10-20%.",
		},
		op_margin: {
			t: "Margine operativo (Operating Margin)",
			b: "Dopo il margine lordo, sottrai anche tutti i costi di funzionamento dell'azienda: stipendi non di produzione, marketing, ricerca e sviluppo, uffici, amministrazione. Cio che rimane e il margine operativo. Misura quanto efficientemente l'azienda trasforma i ricavi in profitto 'prima di tasse e interessi'. Esempio: ricavi $100, margine lordo 70%, costi operativi 45%, margine operativo = 25%. MedTech sani stanno 18-28%, big tech 25-40%, retail 3-8%. Margine operativo in crescita = azienda che sta scalando bene.",
		},
		profit_margin: {
			t: "Profit Margin (Margine netto)",
			b: "Il margine finale: utile netto diviso ricavi, dopo tutto (costi, interessi sul debito, tasse, voci straordinarie). E il 'cash che rimane per gli azionisti' ogni 100 euro di fatturato. Esempio: profit margin 15% = su $100 di ricavi, $15 sono utili netti. Attenzione: puo essere distorto da voci una-tantum (vendita di asset, tasse differite, svalutazioni). Per valutare la vera redditivita serve guardarlo insieme al margine operativo e al FCF.",
		},
		roe: {
			t: "ROE (Return on Equity)",
			b: "Il ritorno sul capitale proprio: quanto utile produce l'azienda per ogni euro di patrimonio netto. E la domanda: 'Se gli azionisti hanno messo dentro 100 euro, quanto tornano indietro ogni anno?'. ROE 20% = 20 euro di utile su 100 euro di equity. ROE sopra 15% e considerato solido; sopra 25% eccellente. Attenzione: ROE molto alto puo essere 'finto' se ottenuto con molto debito (la leva finanziaria amplifica i ritorni ma aumenta il rischio). Per questo si guarda anche il ROA.",
		},
		roa: {
			t: "ROA (Return on Assets)",
			b: "Il ritorno sugli asset totali: quanto utile produce l'azienda per ogni euro di asset (impianti, cassa, inventario, tutto). A differenza del ROE, include anche gli asset finanziati col debito. Se ROE e alto ma ROA e basso, significa che l'azienda usa molto debito. Se ROE e alto E ROA e alto, l'azienda e genuinamente efficiente. Esempio: ROE 20%, ROA 12% = buon bilanciamento; ROE 25%, ROA 3% = leva finanziaria estrema.",
		},
		ebitda: {
			t: "EBITDA",
			b: "Utili prima di Interessi, Tasse, Deprezzamento e Ammortamento. E una misura di 'cassa generata dal core business' ignorando gli effetti di come e finanziata l'azienda (interessi), delle tasse (variabili per paese) e degli ammortamenti (costi contabili che non rappresentano uscite di cassa). Esempio: se l'azienda ha utile netto $10M ma EBITDA $30M, significa che $20M sono assorbiti da ammortamenti, interessi e tasse. L'EBITDA e il preferito nei deal M&A perche rende comparabili aziende con strutture finanziarie diverse.",
		},

		// ─── SALUTE FINANZIARIA ───
		debt_equity: {
			t: "Debt/Equity (Debito / Equity)",
			b: "Il rapporto tra quanto l'azienda ha preso in prestito (debito) e quanto e il capitale proprio degli azionisti (equity). Debt/Equity = 100 significa 1 euro di debito per ogni euro di equity. Sotto 50 = struttura conservativa (tipico di aziende con tanta cassa). Tra 50 e 150 = normale. Sopra 200 = leva aggressiva, l'azienda deve generare molti utili per coprire gli interessi. In regime di tassi alti, un'azienda con D/E alto soffre perche il costo del debito aumenta.",
		},
		current_ratio: {
			t: "Current Ratio",
			b: "Il rapporto tra asset correnti (cassa + crediti + inventario disponibili entro 12 mesi) e passivita correnti (debiti da pagare entro 12 mesi). Misura la capacita di coprire le scadenze a breve senza andare in difficolta di liquidita. Current Ratio 1.5 = per ogni euro di debito a breve, l'azienda ha $1.50 disponibili. Sopra 2 = confortevole, sotto 1 = stress di liquidita (l'azienda rischia di non riuscire a pagare le bollette). E la prima cosa che un banchiere guarda prima di concedere una linea di credito.",
		},
		fcf: {
			t: "FCF (Free Cash Flow)",
			b: "Il 'cash libero' che rimane all'azienda dopo aver pagato le spese operative e gli investimenti necessari per mantenere il business in funzione (CapEx). E cio che puo usare per dividendi, buyback di azioni, M&A o ridurre il debito. E considerata la metrica PIU affidabile dell'utile netto perche non e manipolabile dalla contabilita: o i soldi ci sono in cassa, o no. Esempio: utile netto $10B, FCF $8B = il cash che ha davvero generato. Un'azienda con FCF in crescita costante anno su anno e tipicamente di alta qualita.",
		},
		total_cash: {
			t: "Cash totale",
			b: "La liquidita totale in cassa, inclusi conti correnti bancari e investimenti a brevissimo termine facilmente convertibili in contanti. E il 'cuscinetto' di sicurezza: se l'azienda attraversa un periodo difficile, la cassa serve a pagare stipendi e fornitori senza dover vendere asset o prendere prestiti. Aziende tech mature (Apple, Google, Microsoft) hanno centinaia di miliardi in cassa. Una cassa troppo alta pero puo essere un segnale negativo: significa che il management non sa cosa farne.",
		},
		total_debt: {
			t: "Debito totale",
			b: "La somma di tutti i prestiti bancari e obbligazioni emesse dall'azienda. Va confrontato con cassa ed EBITDA: un'azienda con $50B di debito ma $100B di cassa e fortissima; un'azienda con $50B di debito e solo $5B di EBITDA e fragile. Il rapporto Debito Netto / EBITDA (debito meno cassa, diviso EBITDA) e una delle metriche piu importanti per valutare la salute: sotto 2x e sano, sopra 4x preoccupante.",
		},

		// ─── PROPRIETA ───
		shares_out: {
			t: "Shares Outstanding (Azioni in circolazione)",
			b: "Il numero totale di azioni esistenti dell'azienda, possedute da tutti gli azionisti insieme. Se l'azienda fa buyback (ricompra e distrugge azioni proprie), il numero scende e ogni azione residua 'vale di piu' (stesso utile diviso per meno azioni). Se fa aumenti di capitale, il numero sale e ogni azione 'vale di meno' (diluizione). Esempio: un'azienda che passa da 1B a 0.9B azioni grazie ai buyback regala un +11% meccanico agli azionisti esistenti.",
		},
		pct_insiders: {
			t: "% Insiders (Azioni detenute da dirigenti)",
			b: "Percentuale delle azioni possedute da amministratori, manager e fondatori dell'azienda. Un alto livello di ownership da parte degli insider e generalmente positivo: significa che chi guida l'azienda ha 'skin in the game', cioe e incentivato a creare valore per gli azionisti perche e lui stesso azionista. Esempio: Elon Musk possiede ~13% di Tesla. Attenzione pero: insider che vendono massicciamente le loro azioni e un segnale di warning.",
		},
		pct_institutional: {
			t: "% Istituzionali",
			b: "Percentuale delle azioni possedute da grandi investitori professionali: fondi pensione, asset manager (BlackRock, Vanguard), hedge fund, fondi sovrani. Un'alta ownership istituzionale significa che il titolo e 'seguito' dal buy-side e prezzato in modo efficiente. Oltre l'80% e tipico di big cap mature. Sotto il 30% indica un titolo seguito soprattutto da retail, piu volatile e meno liquido. Le variazioni trimestrali (riportate nei 13F SEC) anticipano spesso i movimenti di prezzo di medio periodo.",
		},
		short_float: {
			t: "Short % Float",
			b: "Percentuale delle azioni disponibili sul mercato (float) che sono state vendute allo scoperto, cioe da investitori che scommettono sul calo del prezzo. Short molto alto (sopra 10%) significa forte pressione ribassista ma anche potenziale per uno 'short squeeze': se il prezzo sale per qualsiasi motivo, gli short sono costretti a ricomprare di fretta e amplificano il rialzo. Esempio: GameStop nel 2021 aveva short oltre il 100% e questo alimento lo squeeze leggendario.",
		},

		// ─── DIVIDENDI ───
		dividend_yield: {
			t: "Dividend Yield",
			b: "Il rendimento da dividendo: quanto l'azienda paga in dividendi ogni anno, in percentuale del prezzo dell'azione. Esempio: azione $100 che paga $3/anno di dividendi = yield 3%. Aziende mature e stabili (utility, banche, consumer staples) pagano yield 2-5%. Aziende growth (tech, biotech) spesso non pagano dividendi: reinvestono tutto il FCF in crescita e M&A. Attenzione: yield molto alto (sopra 8%) puo essere un trappola: indica che il mercato teme un taglio imminente del dividendo.",
		},
		payout_ratio: {
			t: "Payout Ratio",
			b: "La percentuale di utili che l'azienda distribuisce come dividendi. Esempio: utile $1B, dividendi pagati $400M → payout ratio 40%. Sotto il 50% e sostenibile (l'azienda reinveste la meta e distribuisce l'altra meta). Sopra l'80% e rischioso: in caso di calo degli utili, il dividendo rischia il taglio. Sopra il 100% l'azienda sta pagando piu di quanto guadagna, attingendo dalla cassa o prendendo debito, situazione insostenibile.",
		},

		// ─── ANALISTI ───
		target_mean: {
			t: "Target mean (Prezzo obiettivo medio)",
			b: "La media dei prezzi obiettivo a 12 mesi calcolati dagli analisti sell-side (analisti che lavorano per banche e broker: Goldman Sachs, Morgan Stanley, JPMorgan, ecc). Ogni analista pubblica una stima di dove pensa arrivera il titolo tra un anno. La media aggrega queste opinioni. Se spot $65 e target mean $100, upside implicito +54%. Attenzione: gli analisti sbagliano spesso, tendono all'ottimismo e rivedono i target al rialzo dopo le salite e al ribasso dopo i cali (backward-looking).",
		},
		target_median: {
			t: "Target median",
			b: "La mediana dei prezzi obiettivo. Differisce dalla media quando la distribuzione delle stime e asimmetrica: se 9 analisti dicono $100 e uno dice $200, la media e $110 ma la mediana e $100 (piu rappresentativa). Quando media e mediana sono molto diverse, significa che c'e un analista 'outlier' (estremo) che distorce il quadro. La mediana e spesso piu affidabile della media.",
		},
		target_high_low: {
			t: "Target high / low",
			b: "Il target piu alto e piu basso tra quelli pubblicati dagli analisti. La differenza tra i due mostra quanto c'e 'consenso' o disaccordo sul futuro del titolo. Se high e $120 e low e $110 = consenso stretto, tutti vedono uno scenario simile. Se high e $150 e low e $50 = fortissima divergenza di view, il titolo e 'contested' (alcuni lo vedono geniale, altri disastro). I target high tipicamente sono bull cases ottimisti, i low sono scenari di stress.",
		},
		consensus: {
			t: "Consensus (Raccomandazione media)",
			b: "La raccomandazione aggregata dagli analisti, classificata in 5 livelli: Strong Buy, Buy, Hold, Sell, Strong Sell. Serve a capire in un colpo d'occhio come la vede la comunita sell-side. Strong Buy + Buy = maggioranza positiva, Hold = neutrale, Sell = negativa. Attenzione: gli analisti sell-side sono strutturalmente ottimisti (raramente danno Sell perche potrebbe danneggiare i rapporti con l'azienda coperta). Un 'Strong Sell' e un segnale molto forte di sfiducia.",
		},
		rec_mean: {
			t: "Recommendation mean",
			b: "Il consensus analisti tradotto in numero da 1 a 5. 1 = Strong Buy, 2 = Buy, 3 = Hold, 4 = Sell, 5 = Strong Sell. Esempio: rec mean 1.7 = consensus tra Strong Buy e Buy, sostanzialmente rialzista. Rec mean 2.5 = tra Buy e Hold, moderatamente positivo. Sopra 3 = ribassista (raro). E utile per confronti tra titoli e variazioni nel tempo.",
		},
		num_analysts: {
			t: "Numero di analisti",
			b: "Quanti analisti sell-side coprono il titolo pubblicando raccomandazioni e target. E una misura indiretta di 'visibilita' e liquidita editoriale. Big cap come Apple, Microsoft sono coperti da 40-50+ analisti; small cap tipicamente da 5-10. Sotto 10 analisti = titolo scarsamente seguito, piu volatile al singolo rating change. Sopra 25 = titolo seguito dall'intero buy-side, prezzato in modo molto efficiente (le sorprese sono rare).",
		},
		upside: {
			t: "Upside",
			b: "La differenza percentuale tra il target mean degli analisti e il prezzo attuale. Esempio: target mean $100, spot $65 → upside +54%. Indica il potenziale di apprezzamento implicito nelle stime sell-side. Un upside alto (+40% o piu) significa che il mercato e piu cauto degli analisti: o gli analisti sono troppo ottimisti, o il mercato sta sottovalutando qualcosa. Un upside nullo o negativo (target sotto spot) significa che il titolo e gia 'fully valued' secondo gli analisti.",
		},

		// ─── INDICATORI TECNICI ───
		rsi_14: {
			t: "RSI 14 (Relative Strength Index)",
			b: "L'RSI e un indicatore di 'momentum' che misura se un titolo e stato comprato o venduto troppo negli ultimi 14 giorni. Va da 0 a 100. Sopra 70 = ipercomprato (il titolo ha corso troppo, correzione probabile). Sotto 30 = ipervenduto (il titolo e stato bastonato, rimbalzo probabile). Tra 40 e 60 = neutralita. Usato da trader di breve periodo per timing di ingresso/uscita. Esempio: RSI 75 dopo un rally veloce = segnale di prendere profitto parziale. RSI 25 dopo un crollo = possibile zona di accumulo.",
		},
		macd: {
			t: "MACD (Moving Average Convergence Divergence)",
			b: "Il MACD e la differenza tra due medie mobili esponenziali (12 e 26 periodi), con una 'signal line' a 9 periodi. L'istogramma (MACD - Signal) sopra lo zero e in crescita = momentum rialzista. Sotto lo zero e in calo = momentum ribassista. I 'crossover' (quando MACD incrocia la signal) sono segnali classici: incrocio dal basso = buy signal, dall'alto = sell signal. E tra gli indicatori piu usati al mondo, ma va sempre combinato con altri segnali: da solo puo dare falsi positivi in mercati laterali.",
		},
		bollinger_pb: {
			t: "Bollinger %B",
			b: "Il %B indica dove si trova il prezzo all'interno delle Bande di Bollinger (fascia dinamica basata su media mobile e volatilita). 0% = banda inferiore, 50% = linea centrale (media), 100% = banda superiore. Oltre 80% = prezzo vicino al tetto della fascia, spesso preludio di correzione. Sotto 20% = prezzo vicino al fondo, possibile rimbalzo. Il %B e particolarmente utile per identificare fasi di esaurimento del trend in condizioni di alta volatilita.",
		},
		bollinger_width: {
			t: "BB Width (Ampiezza delle Bande)",
			b: "La larghezza delle Bande di Bollinger normalizzata. Indica il regime di volatilita corrente. BB Width basso (bande strette) = periodo di compressione, la volatilita e in calo, spesso anticipa un breakout direzionale violento (in alto o in basso). BB Width alto (bande larghe) = regime di alta volatilita in corso, i movimenti sono gia ampi. I trader usano la compressione ('squeeze') come setup per scommesse su breakout imminenti.",
		},
		sma_generic: {
			t: "SMA (Simple Moving Average)",
			b: "La media semplice dei prezzi di chiusura degli ultimi N giorni. Smorza il rumore e rivela il trend sottostante. SMA 20 = trend di breve. SMA 50 = trend di medio. SMA 200 = trend di lungo. Prezzo sopra SMA in salita = trend rialzista confermato. Prezzo sotto SMA in discesa = trend ribassista. I crossover tra SMA di diversa durata (golden cross, death cross) sono segnali tecnici seguiti da milioni di trader.",
		},
		ema_generic: {
			t: "EMA (Exponential Moving Average)",
			b: "Simile alla SMA ma pesa piu i prezzi recenti rispetto a quelli vecchi, quindi reagisce piu velocemente ai cambiamenti. Le EMA 12 e 26 sono quelle usate nel calcolo del MACD. Le EMA sono preferite dai trader di breve-medio periodo rispetto alle SMA perche 'sentono' prima i cambi di trend. Esempio: in un mercato che gira al ribasso, l'EMA 20 comincia a scendere prima della SMA 20.",
		},
		death_cross: {
			t: "Death Cross",
			b: "Quando la SMA 50 taglia al ribasso la SMA 200. E un segnale tecnico classico di inizio fase bearish di medio-lungo periodo. Storicamente, indici e titoli che entrano in death cross tendono a sottoperformare nei 3-6 mesi successivi, ma il segnale NON e infallibile: in alcuni casi e tardivo (il ribasso e gia quasi finito) e il prezzo rimbalza subito dopo. Il contrario, golden cross (SMA 50 sopra SMA 200), e considerato segnale bullish di inizio trend rialzista.",
		},
		volume: {
			t: "Volume",
			b: "Il numero di azioni scambiate in una seduta. E un indicatore di 'conviction': un rialzo con volumi alti e piu affidabile di un rialzo con volumi scarsi (che puo essere un 'rally fragile'). I picchi di volume accompagnano spesso news importanti, earnings, o movimenti istituzionali. Il volume medio storico serve come benchmark: se oggi il volume e 3x la media, qualcosa di significativo sta succedendo.",
		},

		// ─── OPZIONI ───
		call_option: {
			t: "Call (Opzione di acquisto)",
			b: "Una call e un contratto che ti da il diritto (non l'obbligo) di comprare un'azione a un prezzo fissato (strike) entro una scadenza. Paghi un 'premio' per questo diritto. Se il prezzo del titolo sale sopra lo strike, la call prende valore; se resta sotto, la call scade senza valore e perdi il premio. Esempio: compri una call su BSX strike $70 a $2 di premio. Se BSX sale a $80 alla scadenza, guadagni $80-70-2 = $8 per azione. Se BSX resta a $65, perdi $2 per azione.",
		},
		put_option: {
			t: "Put (Opzione di vendita)",
			b: "Una put ti da il diritto (non l'obbligo) di vendere un'azione a un prezzo fissato (strike) entro una scadenza. Si compra una put per proteggersi da un calo del titolo o per scommettere sul ribasso. Esempio: hai BSX a $65 e compri una put strike $60 a $1.50. Se BSX crolla a $50, eserciti la put e vendi a $60, perdendo solo $5+1.50 per azione invece di $15. Se BSX sale, la put scade senza valore e perdi solo il premio.",
		},
		strike: {
			t: "Strike (Prezzo di esercizio)",
			b: "Lo strike e il prezzo fissato al quale puoi comprare (call) o vendere (put) l'azione se decidi di esercitare l'opzione. E il riferimento centrale del contratto. Strike molto lontano dal prezzo corrente = opzione 'out of the money' (OTM), economica ma poco probabile che venga esercitata. Strike vicino al prezzo corrente = 'at the money' (ATM), piu costosa. Strike dall'altro lato (in guadagno) = 'in the money' (ITM), la piu costosa ma con valore garantito.",
		},
		iv: {
			t: "IV (Volatilita Implicita)",
			b: "L'IV e la volatilita annualizzata che il mercato 'sconta' nel prezzo delle opzioni. Piu alta = il mercato si aspetta movimenti piu ampi del sottostante e quindi i premi delle opzioni sono piu cari. Esempio: IV 30% su un titolo significa che il mercato si aspetta un range annuale di +/- 30% con una certa probabilita. Quando arrivano eventi (earnings, FDA decision), l'IV sale velocemente ('IV crush' quando l'evento passa e la volatilita ripiega). Un trader paga per comprare opzioni quando l'IV e bassa e vende quando e alta.",
		},
		oi: {
			t: "Open Interest (OI)",
			b: "Il numero di contratti di opzione aperti su un certo strike e scadenza. Indica quanti 'scommettori' sono posizionati su quel livello. OI alto = interesse concentrato, quello strike diventa un livello 'psicologicamente' importante per il prezzo del sottostante. Gli analisti studiano l'OI per individuare zone di supporto/resistenza 'artificiali' create dalle posizioni in opzioni. Un picco di OI crescente con volume in aumento su uno strike puo anticipare il movimento del sottostante.",
		},
		itm_otm: {
			t: "ITM / OTM / ATM",
			b: "ITM (In The Money) = opzione gia in guadagno se esercitata ora. Call con strike sotto il prezzo corrente o put con strike sopra il prezzo corrente. OTM (Out of The Money) = opzione fuori denaro, scadrebbe senza valore se esercitata ora. ATM (At The Money) = strike vicino al prezzo corrente. Le OTM costano meno ma sono piu rischiose (alta probabilita di perdere tutto). Le ITM costano di piu ma hanno un valore intrinseco. Le ATM sono quelle piu 'sensibili' ai movimenti.",
		},
		max_pain: {
			t: "Max Pain",
			b: "Il prezzo al quale, alla scadenza delle opzioni, il valore totale combinato di tutte le call e put in circolazione sarebbe minimo, cioe il prezzo a cui i venditori di opzioni (tipicamente market maker istituzionali) perderebbero meno. C'e una teoria di mercato per cui spesso il sottostante 'gravita' verso il max pain avvicinandosi alla scadenza, perche i market maker coprono le loro posizioni. Esempio: se max pain e $65 e spot e $70, alcuni trader scommettono su un calo verso $65 entro la scadenza. Controverso ma osservato da molti option trader.",
		},
		put_call_ratio: {
			t: "Put/Call Ratio",
			b: "Il rapporto tra l'open interest totale delle put e quello delle call su un sottostante. Sopra 1 = piu put che call aperte, sentiment ribassista (o tanti investitori si stanno coprendo da un calo). Sotto 1 = piu call che put, sentiment rialzista. Storicamente un P/C ratio molto alto (sopra 1.2) puo essere un segnale contrarian 'bullish': quando tutti sono pessimisti, il peggio e gia prezzato. Il VIX Put/Call ratio e tra gli indicatori di sentiment piu osservati a Wall Street.",
		},

		// ─── BILANCIO ───
		revenue: {
			t: "Ricavi (Revenue)",
			b: "Il totale delle vendite dell'azienda in un anno (o trimestre). E la prima riga del conto economico, da cui si parte per calcolare utili e margini. Ricavi in crescita anno su anno = azienda che sta espandendo il business. Ricavi in calo = allarme. Attenzione: ricavi in crescita ma margini in calo significa che l'azienda sta vendendo di piu ma a prezzi piu bassi o con costi piu alti (erosione di potere di prezzo). Esempio: ricavi da $10B a $12B = +20%, molto buono.",
		},
		gross_profit: {
			t: "Gross Profit (Utile lordo)",
			b: "Ricavi meno i costi diretti di produzione (COGS: Cost Of Goods Sold). E il primo livello di profittabilita. Serve per calcolare il margine lordo (gross margin = gross profit / ricavi). Misura quanto l'azienda riesce a vendere con un ricarico soddisfacente rispetto al costo di produzione. Esempio: ricavi $100M, COGS $40M, gross profit $60M = margine lordo 60%.",
		},
		operating_income: {
			t: "Operating Income (Utile operativo)",
			b: "Gross profit meno tutte le spese operative (R&D, marketing, SG&A: general e amministrative). E l'utile prima di interessi e tasse (EBIT). Mostra la vera redditivita del business core, ignorando come e finanziata l'azienda. Operating income in crescita = azienda che sta scalando bene. In calo = warning: potrebbe essere pressione competitiva o investimenti pesanti.",
		},
		net_income: {
			t: "Net Income (Utile netto)",
			b: "L'utile finale dell'azienda dopo aver pagato tutto: costi, interessi sul debito, tasse, voci straordinarie. E la 'bottom line' del conto economico. E quello che, diviso per il numero di azioni, da l'EPS (earnings per share). Attenzione: puo essere distorto da voci una-tantum (vendita di asset, tasse differite, svalutazioni): per valutare la vera redditivita conviene guardare anche l'EBITDA e il FCF che sono meno manipolabili.",
		},
		ocf: {
			t: "Operating Cash Flow (OCF)",
			b: "Il cash effettivamente generato dalle attivita operative dell'azienda in un anno. Piu affidabile dell'utile netto perche riflette movimenti di denaro reali, non stime contabili. Esempio: utile netto $5B, OCF $8B = azienda con forti operazioni ma con ammortamenti/svalutazioni che pesano sull'utile netto. OCF negativo = il business core brucia cassa, situazione molto grave a meno che non sia una startup in fase di investimento.",
		},
		icf: {
			t: "Investing Cash Flow (ICF)",
			b: "Il cash impiegato o ricevuto da attivita di investimento: comprare macchinari (CapEx negativo), acquisire altre aziende (M&A, negativo), vendere asset (positivo). Tipicamente e negativo perche le aziende sane investono continuamente. Un ICF molto positivo puo essere segnale di dismissioni (vendita di pezzi dell'azienda per fare cassa), potenzialmente un warning.",
		},
		fcf_calc: {
			t: "Free Cash Flow (FCF)",
			b: "Operating Cash Flow meno CapEx (spese per investimenti necessari). E il cash 'libero' disponibile per dividendi, buyback, riduzione debito o M&A strategico. E la metrica di qualita preferita dagli investitori value (Warren Buffett ne parla continuamente). Un'azienda con FCF in crescita stabile per 5-10 anni e tipicamente di alta qualita e difesa. FCF/Market Cap da il 'FCF yield': oltre 5% e considerato interessante dai value investor.",
		},
		capex: {
			t: "CapEx (Capital Expenditure)",
			b: "Le spese in conto capitale: soldi spesi per comprare o ammodernare macchinari, impianti, immobili, software enterprise. Sono investimenti di lungo termine che generano benefici per anni. Nel cash flow statement appaiono come voci negative (uscite di cassa). Alto CapEx in un'azienda in crescita = segnale positivo (sta investendo per scalare). Alto CapEx in un'azienda matura senza crescita di ricavi = warning (sta investendo molto ma senza ritorno visibile).",
		},

		// ─── NEWS / SENTIMENT ───
		sentiment: {
			t: "Sentiment (Sentimento)",
			b: "Il 'tono' emotivo delle notizie e dei commenti degli investitori sul titolo. Positivo (verde) = news buone, upgrade analisti, earnings beat, FDA approvals, M&A accretive. Negativo (rosso) = profit warning, cause legali, downgrade, scandali, guidance cut. Neutro (giallo) = news informative senza chiara direzione (coperture, report di routine). Il sentiment guida il comportamento degli investitori retail ed e un indicatore leading rispetto ai fondamentali: i mercati spesso si muovono sul sentiment prima che i fondamentali cambino.",
		},
	};

	var DBTooltips = {
		get: function (key) {
			return TIPS[key] || null;
		},
		all: function () {
			return TIPS;
		},
	};

	// CSS for tooltip UI
	var style = document.createElement("style");
	style.textContent = [
		".tip{position:relative;display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;margin-left:.35rem;border-radius:50%;border:1px solid #2d3148;background:#141720;color:#94a3b8;font-size:.62rem;font-weight:700;cursor:pointer;font-family:ui-monospace,Menlo,monospace;vertical-align:middle;line-height:1;user-select:none;transition:all .12s}",
		".tip:hover{border-color:#7c9ef8;color:#7c9ef8;background:rgba(124,158,248,.1)}",
		".tip.on{border-color:#7c9ef8;color:#0f1117;background:#7c9ef8}",
		"#tip-pop{position:fixed;z-index:9998;background:#1a1d27;border:1px solid #7c9ef8;border-radius:10px;padding:1rem 1.1rem;max-width:420px;min-width:280px;font-size:.82rem;line-height:1.6;color:#e2e8f0;box-shadow:0 8px 32px rgba(0,0,0,.5);opacity:0;pointer-events:none;transition:opacity .15s;font-family:system-ui,-apple-system,sans-serif}",
		"#tip-pop.show{opacity:1;pointer-events:auto}",
		"#tip-pop h4{color:#7c9ef8;font-size:.82rem;font-weight:700;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.04em}",
		"#tip-pop p{color:#cbd5e1;font-size:.82rem;line-height:1.65;margin:0}",
		"#tip-pop .tip-close{position:absolute;top:.45rem;right:.55rem;width:22px;height:22px;border-radius:5px;border:none;background:transparent;color:#94a3b8;font-size:.9rem;cursor:pointer;display:flex;align-items:center;justify-content:center}",
		"#tip-pop .tip-close:hover{color:#f87171;background:rgba(248,113,113,.1)}",
		"@media(max-width:500px){#tip-pop{max-width:calc(100vw - 2rem);min-width:0;left:1rem!important;right:1rem!important;width:auto}}",
	].join("\n");
	document.head.appendChild(style);

	// Popover element (single, reused)
	var pop = document.createElement("div");
	pop.id = "tip-pop";
	pop.innerHTML =
		'<button class="tip-close" aria-label="Chiudi">\u2715</button><h4></h4><p></p>';
	document.body.appendChild(pop);
	var popH4 = pop.querySelector("h4");
	var popP = pop.querySelector("p");
	var popClose = pop.querySelector(".tip-close");
	var activeTip = null;

	function hidePop() {
		pop.classList.remove("show");
		if (activeTip) activeTip.classList.remove("on");
		activeTip = null;
	}

	popClose.addEventListener("click", function (e) {
		e.stopPropagation();
		hidePop();
	});

	function showPop(tipEl, key) {
		var data = TIPS[key];
		if (!data) return;
		popH4.textContent = data.t;
		popP.textContent = data.b;
		// Position near the icon
		var rect = tipEl.getBoundingClientRect();
		var popW = Math.min(420, window.innerWidth - 32);
		var left = rect.left + rect.width / 2 - popW / 2;
		left = Math.max(16, Math.min(left, window.innerWidth - popW - 16));
		var top = rect.bottom + 10;
		// If near bottom of viewport, flip above
		if (top + 220 > window.innerHeight) {
			top = rect.top - 220;
			if (top < 60) top = 60;
		}
		pop.style.left = left + "px";
		pop.style.top = top + "px";
		pop.style.width = popW + "px";
		pop.classList.add("show");
		if (activeTip && activeTip !== tipEl)
			activeTip.classList.remove("on");
		activeTip = tipEl;
		tipEl.classList.add("on");
	}

	// Delegation: handle clicks on any .tip[data-tip=...]
	document.addEventListener("click", function (e) {
		var tipEl = e.target.closest && e.target.closest(".tip[data-tip]");
		if (tipEl) {
			e.preventDefault();
			e.stopPropagation();
			var key = tipEl.getAttribute("data-tip");
			if (activeTip === tipEl) {
				hidePop();
			} else {
				showPop(tipEl, key);
			}
			return;
		}
		// Click outside: close
		if (pop.classList.contains("show") && !pop.contains(e.target)) {
			hidePop();
		}
	});

	// Hover desktop
	document.addEventListener("mouseover", function (e) {
		var tipEl = e.target.closest && e.target.closest(".tip[data-tip]");
		if (!tipEl) return;
		if (window.matchMedia && window.matchMedia("(hover:hover)").matches) {
			var key = tipEl.getAttribute("data-tip");
			showPop(tipEl, key);
		}
	});
	document.addEventListener("mouseout", function (e) {
		var tipEl = e.target.closest && e.target.closest(".tip[data-tip]");
		if (!tipEl) return;
		if (window.matchMedia && window.matchMedia("(hover:hover)").matches) {
			// Only hide if not clicked open
			if (!activeTip || activeTip !== tipEl) return;
		}
	});

	// Close on Escape
	document.addEventListener("keydown", function (e) {
		if (e.key === "Escape") hidePop();
	});

	// Close on scroll (popover detached from flow)
	window.addEventListener(
		"scroll",
		function () {
			if (pop.classList.contains("show")) hidePop();
		},
		{ passive: true },
	);

	// Helper: render a tip icon for a given key
	DBTooltips.icon = function (key) {
		return '<span class="tip" data-tip="' + key + '">?</span>';
	};

	window.DBTooltips = DBTooltips;
})();
