// Alternativa a la camara: escribir el codigo del aula a mano.
import { useState } from 'react';
import { Campo, Boton, Tarjeta } from './ui';

export function EntradaAula({ onGuardar }: { onGuardar: (aula: string) => void }) {
  const [codigo, setCodigo] = useState('');
  return (
    <Tarjeta>
      <Campo
        etiqueta="O escribí el código del aula"
        placeholder="Ej: Aula 12"
        value={codigo}
        onChangeText={setCodigo}
      />
      <Boton
        titulo="Usar este código"
        variante="secundario"
        deshabilitado={codigo.trim().length === 0}
        onPress={() => onGuardar(codigo.trim())}
      />
    </Tarjeta>
  );
}
