# Tipos de QR Code e Formatos de Payload

------------------------------------------------------------------------

## 1. URL (Website)

**Descrição:** Abre um site no navegador.

**Modelo**

    https://seusite.com

**Exemplo**

    https://example.com

------------------------------------------------------------------------

## 2. Wi‑Fi

**Descrição:** Permite conectar automaticamente a uma rede Wi‑Fi.

**Modelo**

    WIFI:T:<tipo>;S:<ssid>;P:<senha>;H:<oculto>;;

Campos:

-   `T` → tipo de segurança (`WPA`, `WEP`, `nopass`)
-   `S` → nome da rede (SSID)
-   `P` → senha
-   `H` → rede oculta (`true` ou `false`)

**Exemplo**

    WIFI:T:WPA;S:MinhaRede;P:12345678;H:false;;

------------------------------------------------------------------------

## 3. Telefone

**Descrição:** Abre o discador com o número preenchido.

**Modelo**

    TEL:<numero>

**Exemplo**

    TEL:+5581999999999

------------------------------------------------------------------------

## 4. SMS

**Descrição:** Abre envio de SMS com número e mensagem.

**Modelo**

    SMSTO:<numero>:<mensagem>

**Exemplo**

    SMSTO:+5581999999999:Olá

------------------------------------------------------------------------

## 5. Email

**Descrição:** Abre cliente de email com destinatário.

**Modelo**

    mailto:<email>

**Com assunto e mensagem**

    mailto:<email>?subject=<assunto>&body=<mensagem>

**Exemplo**

    mailto:contato@example.com?subject=Contato&body=Olá

------------------------------------------------------------------------

## 6. Contato (vCard)

**Descrição:** Permite salvar um contato automaticamente.

**Modelo**

    BEGIN:VCARD
    VERSION:3.0
    N:<sobrenome>;<nome>
    TEL:<telefone>
    EMAIL:<email>
    END:VCARD

**Exemplo**

    BEGIN:VCARD
    VERSION:3.0
    N:João Silva 
    TEL:+5581999999999
    EMAIL:joao@email.com
    END:VCARD

------------------------------------------------------------------------

## 7. Evento de Calendário

**Descrição:** Cria um evento no calendário.

**Modelo**

    BEGIN:VEVENT
    SUMMARY:<titulo>
    DTSTART:<data_inicio>
    DTEND:<data_fim>
    END:VEVENT

Formato de data: `YYYYMMDDTHHMMSS`

**Exemplo**

    BEGIN:VEVENT
    SUMMARY:Reunião
    DTSTART:20260307T150000
    DTEND:20260307T160000
    END:VEVENT

------------------------------------------------------------------------

## 8. Localização (Geo)

**Descrição:** Abre coordenadas em aplicativos de mapa.

**Modelo**

    geo:<latitude>,<longitude>

**Exemplo**

    geo:-8.0476,-34.8770

------------------------------------------------------------------------

## 9. Texto Simples

**Descrição:** Apenas exibe texto ao escanear.

**Modelo**

    <qualquer texto>

**Exemplo**

    Bem-vindo ao sistema

------------------------------------------------------------------------

## 10. PIX (BR Code)

**Descrição:** QR Code usado para pagamentos PIX no Brasil.

Formato baseado no padrão **EMVCo**.

**Exemplo**

    00020126360014BR.GOV.BCB.PIX0114email@pix.com520400005303986540510.005802BR5913Nome Recebedor6009SAO PAULO62070503***6304ABCD

Normalmente gerado por bibliotecas específicas.

------------------------------------------------------------------------

## 11. Autenticação 2FA (TOTP)

**Descrição:** Usado para configurar autenticação de dois fatores.

**Modelo**

    otpauth://totp/<servico>:<usuario>?secret=<segredo>&issuer=<servico>

**Exemplo**

    otpauth://totp/GitHub:usuario?secret=ABC123DEF&issuer=GitHub

------------------------------------------------------------------------