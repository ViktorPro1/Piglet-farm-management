export interface Pig {
  id: string;
  name: string;
  tag: string;
  breed: string;
  sex: 'male' | 'female' | 'castrated';
  birthDate: string;
  weight: number;
  status: 'active' | 'pregnant' | 'sold' | 'slaughtered';
  notes: string;
}

export interface Farrowing {
  id: string;
  sowId: string;
  sowName: string;
  matingDate: string;
  expectedDate: string;
  actualDate?: string;
  pigletCount?: number;
  notes: string;
}

export interface Vaccination {
  id: string;
  pigId: string;
  pigName: string;
  vaccine: string;
  date: string;
  nextDate?: string;
  dose: string;
  notes: string;
}

export interface Disease {
  id: string;
  name: string;
  symptoms: string[];
  treatment: string;
  prevention: string;
  severity: 'low' | 'medium' | 'high';
}

export interface Breed {
  id: string;
  name: string;
  origin: string;
  direction: 'meat' | 'bacon' | 'fat' | 'combined';
  avgWeight: number;
  avgLitter: number;
  description: string;
  pros: string[];
  cons: string[];
  imageColor: string;
}
