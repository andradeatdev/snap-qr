"use client";

import { ArrowRight, Calendar, Contact, CreditCard, Globe, Mail, MapPin, MessageSquare, Phone, QrCode as QrCodeIcon, ShieldCheck, Type, Wifi } from "lucide-react";
import dynamic from "next/dynamic";
import { payload as generatePixPayload } from "pix-payload";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Dynamic import for QR Code component to avoid SSR issues with qr-code-styling
const QRCodeDisplay = dynamic(() => import("@/components/qr-code-display").then((mod) => mod.QRCodeDisplay), {
  ssr: false,
});

type QrType = "URL" | "TEXT" | "WIFI" | "VCARD" | "TEL" | "SMS" | "EMAIL" | "EVENT" | "GEO" | "PIX" | "TOTP";

const QR_TYPES = [
  { id: "URL", icon: Globe, label: "URL" },
  { id: "TEXT", icon: Type, label: "Texto" },
  { id: "WIFI", icon: Wifi, label: "Wi-Fi" },
  { id: "VCARD", icon: Contact, label: "vCard" },
  { id: "TEL", icon: Phone, label: "Telefone" },
  { id: "SMS", icon: MessageSquare, label: "SMS" },
  { id: "EMAIL", icon: Mail, label: "Email" },
  { id: "EVENT", icon: Calendar, label: "Evento" },
  { id: "GEO", icon: MapPin, label: "Local" },
  { id: "PIX", icon: CreditCard, label: "PIX" },
  { id: "TOTP", icon: ShieldCheck, label: "2FA" },
] as const;

export default function Page() {
  const [type, setType] = useState<QrType>("URL");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");
  const [vCardName, setVCardName] = useState("");
  const [vCardPhone, setVCardPhone] = useState("");
  const [vCardEmail, setVCardEmail] = useState("");

  const [phone, setPhone] = useState("");
  const [smsPhone, setSmsPhone] = useState("");
  const [smsMessage, setSmsMessage] = useState("");
  const [emailAddr, setEmailAddr] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");
  const [geoLat, setGeoLat] = useState("");
  const [geoLng, setGeoLng] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [pixName, setPixName] = useState("");
  const [pixCity, setPixCity] = useState("");
  const [pixAmount, setPixAmount] = useState("");
  const [totpService, setTotpService] = useState("");
  const [totpUser, setTotpUser] = useState("");
  const [totpSecret, setTotpSecret] = useState("");

  const [activePayload, setActivePayload] = useState("https://snap-qr.vercel.app");

  const generatePayload = () => {
    switch (type) {
      case "URL":
        return url.startsWith("http") ? url : `https://${url}`;
      case "TEXT":
        return text;
      case "WIFI":
        return `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};H:false;;`;
      case "VCARD":
        return `BEGIN:VCARD\nVERSION:3.0\nN:${vCardName}\nTEL:${vCardPhone}\nEMAIL:${vCardEmail}\nEND:VCARD`;
      case "TEL":
        return `TEL:${phone}`;
      case "SMS":
        return `SMSTO:${smsPhone}:${smsMessage}`;
      case "EMAIL":
        return `mailto:${emailAddr}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case "EVENT":
        return `BEGIN:VEVENT\nSUMMARY:${eventTitle}\nDTSTART:${eventStart.replace(/[-:]/g, "")}\nDTEND:${eventEnd.replace(/[-:]/g, "")}\nEND:VEVENT`;
      case "GEO":
        return `geo:${geoLat},${geoLng}`;
      case "PIX":
        try {
          return generatePixPayload({
            key: pixKey,
            name: pixName,
            city: pixCity || "SAO PAULO",
            amount: pixAmount ? Number.parseFloat(pixAmount) : undefined,
            transactionId: "SNAPQR",
          });
        } catch (err) {
          console.error("PIX Generation Error:", err);
          return "";
        }
      case "TOTP":
        return `otpauth://totp/${totpService}:${totpUser}?secret=${totpSecret}&issuer=${totpService}`;
      default:
        return "";
    }
  };

  const handleGenerate = () => {
    const payload = generatePayload();

    let isValid = false;
    switch (type) {
      case "URL":
        isValid = url.trim() !== "";
        break;
      case "TEXT":
        isValid = text.trim() !== "";
        break;
      case "WIFI":
        isValid = wifiSsid.trim() !== "";
        break;
      case "VCARD":
        isValid = vCardName.trim() !== "";
        break;
      case "TEL":
        isValid = phone.trim() !== "";
        break;
      case "SMS":
        isValid = smsPhone.trim() !== "";
        break;
      case "EMAIL":
        isValid = emailAddr.trim() !== "";
        break;
      case "EVENT":
        isValid = eventTitle.trim() !== "";
        break;
      case "GEO":
        isValid = geoLat.trim() !== "" && geoLng.trim() !== "";
        break;
      case "PIX":
        isValid = pixKey.trim() !== "" && pixName.trim() !== "";
        break;
      case "TOTP":
        isValid = totpSecret.trim() !== "";
        break;
    }

    if (!isValid) {
      toast.error("Por favor, preencha os campos obrigatórios antes de gerar.");
      return;
    }

    setActivePayload(payload);
    toast.success("QR Code gerado com sucesso!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <header className="h-14 w-full px-4 sm:px-10 flex items-center justify-between bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <QrCodeIcon className="text-[#e2583e] size-8" />
          <span className="text-2xl font-semibold uppercase tracking-tighter">
            <span className="text-[#e2583e] font-normal">Snap</span>QR
          </span>
        </div>

        {/* <div className="gap-4 items-center hidden sm:flex">
          <Button className="font-semibold uppercase text-xs tracking-wider" variant="outline">
            Entrar
          </Button>
          <Button className="font-semibold uppercase text-xs tracking-wider bg-[#e2583e] hover:bg-[#c94d35] text-white">Cadastrar</Button>
        </div> */}
      </header>

      <main className="flex grow w-full flex-col">
        <div className="flex flex-col lg:flex-row grow w-full">
          {/* Coluna Esquerda: Inputs */}
          <div className="flex-1 flex gap-8 flex-col justify-center px-6 py-12 sm:px-12 lg:px-24 border-r border-zinc-200 dark:border-zinc-800">
            <div>
              <h1 className="flex flex-col text-5xl font-bold leading-[1.05] tracking-tighter sm:text-6xl md:text-7xl uppercase">
                <span className="text-[#e2583e]">Snap</span>QR
              </h1>
              <p className="mt-6 text-base sm:text-lg text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed font-medium italic">
                Crie QR Codes personalizados instantaneamente.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase mb-3 block">1. Selecione o tipo</span>
                <Select value={type} onValueChange={(val) => setType(val as QrType)}>
                  <SelectTrigger className="w-full h-12 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-sm font-semibold">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="max-h-75">
                    {QR_TYPES.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        <div className="flex items-center gap-2">
                          <item.icon className="size-4 text-[#e2583e]" />
                          <span>{item.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase block">2. Conteúdo</span>

                {type === "URL" && (
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-[#e2583e] uppercase ml-1">URL / Website</span>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Globe className="size-4 text-[#e2583e]" />
                      </div>
                      <Input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://exemplo.com"
                        className="h-14 pl-12 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-[#e2583e]/20"
                      />
                    </div>
                  </div>
                )}

                {type === "TEXT" && (
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-[#e2583e] uppercase ml-1">Seu Texto</span>
                    <Textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Digite seu texto aqui..."
                      className="w-full h-32 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:ring-[#e2583e]/20 transition-all resize-none"
                    />
                  </div>
                )}

                {type === "WIFI" && (
                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-[#e2583e] uppercase ml-1">SSID / Nome da Rede</span>
                      <Input value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} placeholder="Minha rede Wi-Fi" className="h-12 bg-white dark:bg-zinc-900" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase ml-1">Senha (Opcional)</span>
                      <Input
                        value={wifiPassword}
                        onChange={(e) => setWifiPassword(e.target.value)}
                        placeholder="Minha senha segura"
                        type="password"
                        className="h-12 bg-white dark:bg-zinc-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-[#e2583e] uppercase ml-1">Segurança</span>
                      <Select value={wifiEncryption} onValueChange={setWifiEncryption}>
                        <SelectTrigger className="h-12 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-sm">
                          <SelectValue placeholder="Segurança" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="WPA">WPA/WPA2</SelectItem>
                          <SelectItem value="WEP">WEP</SelectItem>
                          <SelectItem value="nopass">Sem senha</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {type === "VCARD" && (
                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-[#e2583e] uppercase ml-1">Nome Completo</span>
                      <Input value={vCardName} onChange={(e) => setVCardName(e.target.value)} placeholder="João Silva" className="h-12 bg-white dark:bg-zinc-900" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase ml-1">Telefone (Opcional)</span>
                      <Input value={vCardPhone} onChange={(e) => setVCardPhone(e.target.value)} placeholder="+55 (11) 99999-9999" className="h-12 bg-white dark:bg-zinc-900" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase ml-1">Email (Opcional)</span>
                      <Input
                        value={vCardEmail}
                        onChange={(e) => setVCardEmail(e.target.value)}
                        placeholder="joao@exemplo.com"
                        type="email"
                        className="h-12 bg-white dark:bg-zinc-900"
                      />
                    </div>
                  </div>
                )}

                {type === "TEL" && (
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-[#e2583e] uppercase ml-1">Número de Telefone</span>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+55 (11) 99999-9999" className="h-14 bg-white dark:bg-zinc-900" />
                  </div>
                )}

                {type === "SMS" && (
                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-[#e2583e] uppercase ml-1">Número de Telefone</span>
                      <Input value={smsPhone} onChange={(e) => setSmsPhone(e.target.value)} placeholder="+55 (11) 99999-9999" className="h-12 bg-white dark:bg-zinc-900" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase ml-1">Mensagem (Opcional)</span>
                      <Textarea
                        value={smsMessage}
                        onChange={(e) => setSmsMessage(e.target.value)}
                        placeholder="Escreva sua mensagem..."
                        className="w-full h-24 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:ring-[#e2583e]/20 transition-all resize-none"
                      />
                    </div>
                  </div>
                )}

                {type === "EMAIL" && (
                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-[#e2583e] uppercase ml-1">Destinatário (Email)</span>
                      <Input value={emailAddr} onChange={(e) => setEmailAddr(e.target.value)} placeholder="suporte@exemplo.com" className="h-12 bg-white dark:bg-zinc-900" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase ml-1">Assunto (Opcional)</span>
                      <Input
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        placeholder="Dúvida sobre o produto"
                        className="h-12 bg-white dark:bg-zinc-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase ml-1">Mensagem (Opcional)</span>
                      <Textarea
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        placeholder="Olá, gostaria de saber mais sobre..."
                        className="w-full h-24 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:ring-[#e2583e]/20 transition-all resize-none"
                      />
                    </div>
                  </div>
                )}

                {type === "EVENT" && (
                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-[#e2583e] uppercase ml-1">Título do Evento</span>
                      <Input value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} placeholder="Aniversário do João" className="h-12 bg-white dark:bg-zinc-900" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-[#e2583e] uppercase ml-1">Início</span>
                        <Input value={eventStart} onChange={(e) => setEventStart(e.target.value)} type="datetime-local" className="h-12 bg-white dark:bg-zinc-900" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-zinc-400 uppercase ml-1">Fim (Opcional)</span>
                        <Input value={eventEnd} onChange={(e) => setEventEnd(e.target.value)} type="datetime-local" className="h-12 bg-white dark:bg-zinc-900" />
                      </div>
                    </div>
                  </div>
                )}

                {type === "GEO" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-[#e2583e] uppercase ml-1">Latitude</span>
                      <Input value={geoLat} onChange={(e) => setGeoLat(e.target.value)} placeholder="-23.5505" className="h-12 bg-white dark:bg-zinc-900" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-[#e2583e] uppercase ml-1">Longitude</span>
                      <Input value={geoLng} onChange={(e) => setGeoLng(e.target.value)} placeholder="-46.6333" className="h-12 bg-white dark:bg-zinc-900" />
                    </div>
                  </div>
                )}

                {type === "PIX" && (
                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-[#e2583e] uppercase ml-1">Chave PIX</span>
                      <Input value={pixKey} onChange={(e) => setPixKey(e.target.value)} placeholder="E-mail, CPF ou Aleatória" className="h-12 bg-white dark:bg-zinc-900" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-[#e2583e] uppercase ml-1">Nome do Recebedor</span>
                      <Input value={pixName} onChange={(e) => setPixName(e.target.value)} placeholder="João Silva" className="h-12 bg-white dark:bg-zinc-900" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-zinc-400 uppercase ml-1">Cidade (Opcional)</span>
                        <Input value={pixCity} onChange={(e) => setPixCity(e.target.value)} placeholder="São Paulo" className="h-12 bg-white dark:bg-zinc-900" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-zinc-400 uppercase ml-1">Valor (Opcional)</span>
                        <Input value={pixAmount} onChange={(e) => setPixAmount(e.target.value)} placeholder="150.00" className="h-12 bg-white dark:bg-zinc-900" />
                      </div>
                    </div>
                  </div>
                )}

                {type === "TOTP" && (
                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase ml-1">Serviço (Opcional)</span>
                      <Input value={totpService} onChange={(e) => setTotpService(e.target.value)} placeholder="GitHub" className="h-12 bg-white dark:bg-zinc-900" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase ml-1">Usuário (Opcional)</span>
                      <Input value={totpUser} onChange={(e) => setTotpUser(e.target.value)} placeholder="meu-usuario" className="h-12 bg-white dark:bg-zinc-900" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-[#e2583e] uppercase ml-1">Segredo (Chave)</span>
                      <Input value={totpSecret} onChange={(e) => setTotpSecret(e.target.value)} placeholder="JBSWY3DPEHPK3PXP" className="h-12 bg-white dark:bg-zinc-900" />
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={handleGenerate}
                className="w-full bg-[#e2583e] hover:bg-[#c94d35] text-white font-black py-8 rounded-xl uppercase text-sm tracking-[0.2em] flex justify-center items-center gap-3 shadow-xl shadow-[#e2583e]/20 active:scale-[0.98] transition-all"
              >
                Gerar QR Code
                <ArrowRight className="size-5" />
              </Button>
            </div>
          </div>

          {/* Coluna Direita: Preview */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 sm:px-12 lg:p-24 bg-zinc-100 dark:bg-zinc-900/50">
            <QRCodeDisplay payload={activePayload} />

            <div className="w-full max-w-sm mt-12 grid grid-cols-3 gap-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
              <div className="text-center">
                <span className="block text-[8px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2">Formato</span>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">SVG/PNG</span>
              </div>
              <div className="text-center">
                <span className="block text-[8px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2">Velocidade</span>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Instantâneo</span>
              </div>
              <div className="text-center">
                <span className="block text-[8px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2">Privacidade</span>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Seguro</span>
              </div>
            </div>
          </div>
        </div>

        <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 sm:px-12 py-6 flex flex-col sm:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 gap-4">
          <span>© 2026 SNAPQR — DIGITAL SOLUTIONS</span>
          <div className="flex gap-8">
            <a href="/privacy" className="hover:text-[#e2583e] transition-colors">
              Políticas
            </a>
            <a href="/terms" className="hover:text-[#e2583e] transition-colors">
              Termos
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
