"""
Templates para emails improdutivos organizados por categoria
Cai como fallback se não for possível gerar resposta com IA
"""

UNPRODUCTIVE_TEMPLATES = {
    'spam_promotions': [
        "Prezado(a), agradecemos o contato, mas nossa empresa não tem interesse em promoções. Por favor, remova nosso endereço de sua lista de envios. Atenciosamente, Departamento Comercial.",
        "Recebemos sua oferta promocional, mas nossa empresa não está interessada. Por favor, não nos envie mais comunicações deste tipo. Cordialmente, Equipe Comercial.",
        "Obrigado pela proposta promocional, mas nossa diretoria não tem interesse. Por favor, remova nosso email de sua lista. Atenciosamente, Gerência de Compras."
    ],
    
    'personal_greetings': [
        "Prezado(a), agradecemos suas felicitações e carinho. Nossa empresa foca exclusivamente em comunicações comerciais. Por favor, remova nosso endereço de sua lista pessoal. Atenciosamente, Departamento de Relacionamento.",
        "Recebemos suas saudações com carinho. Embora apreciemos a mensagem, nossa empresa mantém foco comercial. Por favor, não nos envie mais comunicações pessoais. Cordialmente, Equipe Comercial.",
        "Obrigado pelas felicitações. Nossa empresa agradece o carinho, mas foca em comunicações profissionais. Por favor, remova nosso email de sua lista pessoal. Atenciosamente, Diretoria."
    ],
    
    'scams_fraud': [
        "Prezado(a), nossa empresa não tem interesse em propostas suspeitas. Por favor, remova nosso endereço de sua lista de contatos imediatamente. Atenciosamente, Departamento de Segurança.",
        "Recebemos sua mensagem, mas nossa empresa não participa de esquemas ou loterias. Por favor, não nos envie mais comunicações. Cordialmente, Departamento de Segurança.",
        "Nossa empresa não tem interesse em propostas suspeitas. Por favor, remova nosso email de sua lista imediatamente. Atenciosamente, Gerência de Segurança."
    ],
    
    'adult_content': [
        "Prezado(a), nossa empresa não aceita comunicações com conteúdo inadequado. Por favor, remova nosso endereço de sua lista imediatamente. Atenciosamente, Departamento de Segurança.",
        "Recebemos sua mensagem, mas nossa empresa mantém padrões profissionais rigorosos. Por favor, não nos envie mais comunicações deste tipo. Cordialmente, Departamento de Recursos Humanos.",
        "Nossa empresa não tolera comunicações inadequadas. Por favor, remova nosso email de sua lista imediatamente. Atenciosamente, Diretoria Executiva."
    ],
    
    'social_media': [
        "Prezado(a), agradecemos o convite para redes sociais, mas nossa empresa foca em comunicações comerciais. Por favor, remova nosso endereço de sua lista. Atenciosamente, Departamento de Marketing.",
        "Recebemos seu convite social, mas nossa empresa mantém foco profissional. Por favor, não nos envie mais convites de redes sociais. Cordialmente, Equipe de Marketing.",
        "Obrigado pelo convite, mas nossa empresa não participa de redes sociais pessoais. Por favor, remova nosso email de sua lista. Atenciosamente, Gerência de Marketing."
    ]
}

# Templates genéricos para emails improdutivos
GENERIC_UNPRODUCTIVE_TEMPLATES = [
    "Prezado(a), agradecemos o contato, mas nossa empresa não tem interesse neste tipo de comunicação. Por favor, remova nosso endereço de sua lista de contatos. Atenciosamente, Departamento de Relacionamento.",
    "Recebemos sua mensagem, mas nossa empresa não está interessada nesta proposta. Por favor, não nos envie mais comunicações deste tipo. Cordialmente, Equipe Comercial.",
    "Obrigado pelo contato, mas nossa diretoria não tem interesse nesta oportunidade. Por favor, remova nosso email de sua lista de envios. Atenciosamente, Diretoria Executiva.",
    "Agradecemos o envio, mas nossa empresa não está interessada neste tipo de serviço. Por favor, não nos envie mais comunicações. Cordialmente, Departamento Comercial."
]
