/**
 * Entidad de dominio: Client
 *
 * Representa el modelo base de un cliente en el sistema.
 * Esta entidad define las reglas mínimas del negocio.
 */
export interface Client {
  /** Identificador único del cliente */
  id: number;

  /** Nombre completo del cliente */
  name: string;

  /** Correo electrónico opcional del cliente */
  email?: string;

  /** Teléfono de contacto opcional */
  phone?: string;

  /** Fecha de creación (puede agregarse más adelante desde la BD) */
  createdAt?: Date;
}
