import { useMemo, useState } from "react";
import type { Property, PropertyFormData, UserRole } from "../domain/Property";

const EMPTY_FORM: PropertyFormData = {
  title: "",
  type: "Apartamento",
  mode: "Venda",
  price: "",
  condo: "",
  iptu: "",
  bedrooms: "1",
  bathrooms: "1",
  parking: "0",
  size: "",
  city: "Recife",
  neighborhood: "",
  address: "",
  description: "",
  features: "",
  photos: "",
  isExclusive: false,
  status: "Ativo",
  brokerId: "",
};

const validationLabels: Record<keyof PropertyFormData, string> = {
  title: "Título",
  type: "Tipo",
  mode: "Finalidade",
  price: "Preço",
  condo: "Condomínio",
  iptu: "IPTU",
  bedrooms: "Quartos",
  bathrooms: "Banheiros",
  parking: "Vagas",
  size: "Área",
  city: "Cidade",
  neighborhood: "Bairro",
  address: "Endereço",
  description: "Descrição",
  features: "Características",
  photos: "Fotos",
  isExclusive: "Exclusivo",
  status: "Status",
  brokerId: "Corretor",
};

const parseCurrency = (value: string) => Number(value.replace(/[^\d.,]/g, "").replace(".", "").replace(",", ".") || 0);

const buildPhotoList = (value: string) => value
  .split(/\r?\n|,|;/)
  .map((item) => item.trim())
  .filter(Boolean);

const buildFormFromProperty = (property: Property): PropertyFormData => ({
  title: property.title,
  type: property.type,
  mode: property.mode,
  price: String(property.price),
  condo: String(property.condo),
  iptu: String(property.iptu),
  bedrooms: String(property.bedrooms),
  bathrooms: String(property.bathrooms),
  parking: String(property.parking),
  size: String(property.size),
  city: property.city,
  neighborhood: property.neighborhood,
  address: property.address,
  description: property.description,
  features: property.features.join(", "),
  photos: (property.imageUrls?.length ? property.imageUrls : [property.imageUrl]).join("\n"),
  isExclusive: property.isExclusive,
  status: property.status,
  brokerId: property.brokerId || "",
});

export const usePropertyForm = (role: UserRole, currentBrokerId?: string) => {
  const [formData, setFormData] = useState<PropertyFormData>(EMPTY_FORM);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof PropertyFormData, string>>>({});

  const isEditing = useMemo(() => Boolean(editingProperty), [editingProperty]);

  const openCreate = () => {
    setEditingProperty(null);
    setFormData({
      ...EMPTY_FORM,
      brokerId: role === "CORRETOR" ? currentBrokerId || "broker-logged" : "",
    });
    setFieldErrors({});
    setErrorMessage("");
    setIsOpen(true);
  };

  const openEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData(buildFormFromProperty(property));
    setFieldErrors({});
    setErrorMessage("");
    setIsOpen(true);
  };

  const closeForm = () => {
    setIsOpen(false);
    setEditingProperty(null);
    setFieldErrors({});
    setErrorMessage("");
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof PropertyFormData, string>> = {};

    const requiredFields: Array<keyof PropertyFormData> = [
      "title",
      "type",
      "mode",
      "price",
      "bedrooms",
      "bathrooms",
      "parking",
      "size",
      "city",
      "neighborhood",
      "address",
      "description",
      "photos",
      "status",
    ];

    requiredFields.forEach((field) => {
      if (!String(formData[field]).trim()) {
        nextErrors[field] = `${validationLabels[field]} é obrigatório.`;
      }
    });

    if (role === "ADMIN" && !formData.brokerId.trim()) {
      nextErrors.brokerId = "Selecione um corretor responsável.";
    }

    if (parseCurrency(formData.price) <= 0) {
      nextErrors.price = "Informe um preço válido.";
    }

    if (Number(formData.size) <= 0) {
      nextErrors.size = "A área deve ser maior que zero.";
    }

    if (formData.description.trim().length < 20) {
      nextErrors.description = "A descrição deve ter pelo menos 20 caracteres.";
    }

    if (buildPhotoList(formData.photos).length === 0) {
      nextErrors.photos = "Informe pelo menos uma foto do imóvel.";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (onSave: (property: Property, isEditing: boolean) => void) => {
    if (!validate()) {
      setErrorMessage("Revise os campos obrigatórios antes de salvar.");
      return false;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));

      const imageUrls = buildPhotoList(formData.photos);

      const mappedProperty: Property = {
        id: editingProperty?.id || `property-${Date.now()}`,
        title: formData.title.trim(),
        type: formData.type,
        mode: formData.mode,
        price: parseCurrency(formData.price),
        condo: parseCurrency(formData.condo),
        iptu: parseCurrency(formData.iptu),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        parking: Number(formData.parking),
        size: Number(formData.size),
        city: formData.city.trim(),
        neighborhood: formData.neighborhood.trim(),
        address: formData.address.trim(),
        description: formData.description.trim(),
        features: formData.features.split(",").map((item) => item.trim()).filter(Boolean),
        imageUrl: imageUrls[0],
        imageUrls,
        isExclusive: formData.isExclusive,
        status: formData.status,
        brokerId: role === "CORRETOR" ? currentBrokerId || "broker-logged" : formData.brokerId,
        brokerName: role === "CORRETOR" ? "Meu Portfólio" : undefined,
        createdAt: editingProperty?.createdAt || new Date().toISOString(),
      };

      onSave(mappedProperty, Boolean(editingProperty));
      closeForm();
      return true;
    } catch {
      setErrorMessage("Não foi possível comunicar com o back-end. Tente novamente.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    fieldErrors,
    errorMessage,
    isSubmitting,
    isOpen,
    isEditing,
    editingProperty,
    openCreate,
    openEdit,
    closeForm,
    submit,
  };
};
