// src/data/health-units-mock.ts

import { HealthUnit } from "@/types/health-units";

// Lista base de todas as unidades com nome, endereço e coordenadas corretas de Marília, SP
const allUnitsData = [
    { name: "UBS Alto Cafezal", address: "Rua Paes Lemes, 850", lat: -22.218229, lon: -49.956679 },
    { name: "UBS Bandeirantes", address: "Rua Albericio Mendes Pinto, 96", lat: -22.202076, lon: -49.969947 },
    { name: "UBS Cascata", address: "Rua Cláudio Manoel da Costa, 43", lat: -22.213551, lon: -49.941483 },
    { name: "UBS Castelo Branco", address: "Rua Adamantina, 15", lat: -22.188219, lon: -49.958947 },
    { name: "UBS Chico Mendes", address: "Rua Amador Bueno, 1085", lat: -22.220932, lon: -49.971957 },
    { name: "UBS Costa e Silva", address: "Rua Fernando Fontana, 300", lat: -22.24092, lon: -49.929256 },
    { name: "USF J.K.", address: "Rua Lucílio Coelho de Oliveira, 5", lat: -22.210847, lon: -49.962205 },
    { name: "UBS Planalto", address: "Rua Gildo Bonato, 207", lat: -22.250841, lon: -49.936068 },
    { name: "UBS São Judas", address: "Rua Ribeirão Preto, 510", lat: -22.197578, lon: -49.952804 },
    { name: "UBS São Miguel", address: "Rua 24 de Dezembro, 2865", lat: -22.207679, lon: -49.942408 },
    { name: "USF Aniz Badra", address: "Rua Urias Avelino de Moraes, s/n", lat: -22.167588, lon: -49.955456 },
    { name: "USF Parque das Nações", address: "Rua Antonio Spressão, 465", lat: -22.207006, lon: -49.879692 },
    { name: "USF Jardim Cavalari", address: "Rua João Gerônimo Perinetti, 94", lat: -22.188261, lon: -49.975131 },
    { name: "USF Vila Real", address: "Rua Arthur Martins Ribeiro, 35", lat: -22.248564, lon: -49.944339 },
    { name: "USF Jânio Quadros", address: "Rua Felipe Navas, 204", lat: -22.174304, lon: -49.952332 },
    { name: "USF Lácio", address: "Av. Brasil, 272", lat: -22.331754, lon: -49.998572 },
    { name: "USF Vila Barros", address: "Rua Amando Oliveira Rocha Filho, 10", lat: -22.188697, lon: -49.95184 },
    { name: "USF Aeroporto", address: "Rua Iporâs, 5", lat: -22.231939, lon: -49.934559 },
    { name: "USF Marajó", address: "Rua Japão, 380", lat: -22.197787, lon: -49.953579 },
    { name: "USF Santa Antonieta II", address: "Rua Luciano Borguetti, 148", lat: -22.208314, lon: -49.982592 },
    { name: "USF Tóffoli", address: "Rua Yutaka Kamakura, 34", lat: -22.182094, lon: -49.965009 },
    { name: "USF Vila Hípica", address: "Rua Luiz Manhães, 156", lat: -22.231717, lon: -49.998471 },
    { name: "USF Novo Horizonte", address: "Rua Orlando Silva, 15", lat: -22.19948, lon: -49.981631 },
    { name: "USF Jardim América IV", address: "Rua Arnaldo Silva, 63", lat: -22.194614, lon: -49.967473 },
    { name: "UPA Norte", address: "Rua João Caliman, 110, Parque das Nações", lat: -22.200507, lon: -49.937233 },
    { name: "UPA Zona Sul", address: "Rua Antônio Pereira da Silva, 288", lat: -22.235632, lon: -49.956892 },
    { name: "Farmácia Municipal Zona Norte", address: "Av. Berta de Camargo Vieira, 595", lat: -22.184438, lon: -49.965975 },
    { name: "Farmácia Municipal Zona Sul", address: "Av. João Ramalho, 1081", lat: -22.23977, lon: -49.944641 },
    { name: "Farmácia Municipal Zona Oeste", address: "Av. Maria Fernandes Cavallari, 2287", lat: -22.213019, lon: -49.988258 },
    { name: "Farmácia Municipal Zona Leste", address: "Rua Santa Helena, 396", lat: -22.211566, lon: -49.93717 },
    { name: "Farmácia Popular do Brasil – Centro", address: "Avenida Brasil, 184, Centro", lat: -22.215356, lon: -49.946855 },
    { name: "UCAF - Unidade Central de Assistência Farmacêutica", address: "Avenida Brasil, 184, Marília - SP", lat: -22.215356, lon: -49.946855 },
];

// Dados de exemplo para medicamentos
const mockMedications = [
    { name: "Paracetamol", dosage: "500mg" },
    { name: "Dipirona", dosage: "500mg" },
    { name: "Ibuprofeno", dosage: "400mg" },
    { name: "Amoxicilina", dosage: "250mg" },
    { name: "Losartana", dosage: "50mg" },
    { name: "Sinvastatina", dosage: "20mg" },
    { name: "Metformina", dosage: "850mg" },
    { name: "Omeprazol", dosage: "20mg" },
];

// Status possíveis para as unidades
const statuses: Array<'healthy' | 'normal' | 'attention' | 'urgent'> = ['healthy', 'normal', 'attention', 'urgent'];

// Exporta a lista final de unidades com dados de exemplo gerados aleatoriamente
export const healthUnits: HealthUnit[] = allUnitsData.map((unit, index) => {
    const randomMedications = mockMedications
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 10) + 5)
        .map((med, medIndex) => {
            const quantity = Math.floor(Math.random() * 500);
            const minStock = 50;
            const maxStock = 400;
            let status: 'healthy' | 'normal' | 'attention' | 'urgent' = 'healthy';
            
            if (quantity === 0) status = 'urgent';
            else if (quantity < minStock) status = 'attention';
            else if (quantity < minStock * 1.5) status = 'normal';

            return {
                id: `med-${index}-${medIndex}`,
                ...med,
                quantity,
                minStock,
                maxStock,
                status,
            };
        });

    let type: 'UBS' | 'UPA' | 'Hospital' | 'Clínica' | 'Farmácia' | 'USF' | 'Farmácia Popular' | 'UCAF' = 'UBS';
    if (unit.name.includes('UCAF')) type = 'UCAF';
    else if (unit.name.includes('UBS')) type = 'UBS';
    else if (unit.name.includes('USF')) type = 'USF';
    else if (unit.name.includes('UPA')) type = 'UPA';
    else if (unit.name.includes('Farmácia')) type = 'Farmácia';

    const isUCAF = unit.name.includes('UCAF');
    
    return {
        id: `unit-${index}`,
        name: unit.name,
        address: unit.address,
        coordinates: [unit.lat, unit.lon],
        type,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        workingHours: isUCAF ? '08:00 - 17:00' : '07:00 - 17:00',
        phone: isUCAF ? '(14) 3402-0712' : '(14) 3402-1234',
        manager: 'Dr. João Silva',
        services: ['Consultas', 'Vacinação', 'Curativos'],
        medications: randomMedications,
    };
});