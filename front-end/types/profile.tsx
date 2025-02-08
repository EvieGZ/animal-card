export interface Animal {
    id: number;
    image: File | null;
    name: string;
    lastname: string | null;
    description: string | null;
    birthday: string;
    gender: string;
    birthmark : number;
    animal_type: string;
    address_id: string | null;
    owner_id: string | null;
  }

  export interface addProfile  {
    image: File | null;
    name: string;
    lastname: string;
    description: string;
    birthday: string;
    gender: string;
    birthmark : number;
    animal_type: string;
    address_id: string;
    owner_id: string;
  };