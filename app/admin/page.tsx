"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/format";

type Profile = {
  role: "admin" | "editor";
};

type Product = {
  id: string;
  title: string;
  slug: string;
  description: string;
  brand: string;
  compatible_brands: string;
  price: number;
  currency: string;
  image: string | null;
};

const emptyProductForm = {
  title: "",
  description: "",
  brand: "",
  compatibleBrands: "",
  price: "",
  image: ""
};

export default function AdminPage() {
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [createForm, setCreateForm] = useState({ ...emptyProductForm });
  const [editForm, setEditForm] = useState({ ...emptyProductForm });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settingsNumber, setSettingsNumber] = useState("");
  const [settingsEmail, setSettingsEmail] = useState("");
  const [settingsSocials, setSettingsSocials] = useState({
    instagramUrl: "",
    facebookUrl: "",
    tiktokUrl: "",
    youtubeUrl: "",
    xUrl: ""
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settingsSaved, setSettingsSaved] = useState<string | null>(null);

  const isEditor = profile?.role === "editor" || profile?.role === "admin";
  const isAdmin = profile?.role === "admin";

  const formatArsInput = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";
    const numberValue = Number(digits);
    return new Intl.NumberFormat("es-AR").format(numberValue);
  };

  const parseArsInput = (value: string) => {
    return Number(value.replace(/\D/g, "")) || 0;
  };

  const slugify = (value: string) => {
    return value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const fetchProfile = async (userId: string) => {
    setProfile(null);
    setProfileError(null);
    setProfileLoading(true);

    const { data: profileData, error: profileFetchError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    if (profileFetchError) {
      setProfileError(profileFetchError.message);
      setProfile(null);
    } else if (profileData?.role) {
      setProfile(profileData as Profile);
    } else {
      setProfile(null);
    }

    setProfileLoading(false);
  };

  const loadProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    setProducts((data as Product[]) || []);
  };

  const loadSettings = async () => {
    setSettingsLoading(true);
    setSettingsError(null);
    setSettingsSaved(null);

    const { data, error: settingsLoadError } = await supabase
      .from("site_settings")
      .select(
        "whatsapp_number, contact_email, instagram_url, facebook_url, tiktok_url, youtube_url, x_url"
      )
      .eq("id", true)
      .maybeSingle();

    if (settingsLoadError) {
      setSettingsError(settingsLoadError.message);
      setSettingsNumber("");
      setSettingsEmail("");
    } else {
      setSettingsNumber((data?.whatsapp_number ?? "").toString());
      setSettingsEmail((data?.contact_email ?? "").toString());
      setSettingsSocials({
        instagramUrl: (data?.instagram_url ?? "").toString(),
        facebookUrl: (data?.facebook_url ?? "").toString(),
        tiktokUrl: (data?.tiktok_url ?? "").toString(),
        youtubeUrl: (data?.youtube_url ?? "").toString(),
        xUrl: (data?.x_url ?? "").toString()
      });
    }

    setSettingsLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user?.id ?? null;
      setSessionUserId(userId);
      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const userId = session?.user?.id ?? null;
      setSessionUserId(userId);
      if (!userId) {
        setProfile(null);
        setProfileError(null);
        setProfileLoading(false);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (sessionUserId) {
      fetchProfile(sessionUserId);
    }
  }, [sessionUserId]);

  useEffect(() => {
    if (sessionUserId) {
      loadProducts();
    }
  }, [sessionUserId]);

  useEffect(() => {
    if (isAdmin) {
      loadSettings();
    }
  }, [isAdmin]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) {
      setError(signInError.message);
    }
  };

  const handleSignUp = async () => {
    setError(null);
    const email = prompt("Email para crear cuenta") || "";
    const password = prompt("Password inicial") || "";
    if (!email || !password) {
      setError("Email y password requeridos");
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      setError(signUpError.message);
    } else {
      setError("Cuenta creada. El rol por defecto es editor.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleSaveSettings = async () => {
    setSettingsError(null);
    setSettingsSaved(null);
    if (!isAdmin) {
      setSettingsError("No autorizado");
      return;
    }

    const payload = {
      id: true,
      whatsapp_number: settingsNumber.trim() || null,
      contact_email: settingsEmail.trim() || null,
      instagram_url: settingsSocials.instagramUrl.trim() || null,
      facebook_url: settingsSocials.facebookUrl.trim() || null,
      tiktok_url: settingsSocials.tiktokUrl.trim() || null,
      youtube_url: settingsSocials.youtubeUrl.trim() || null,
      x_url: settingsSocials.xUrl.trim() || null
    };

    const { error: settingsSaveError } = await supabase
      .from("site_settings")
      .upsert(payload, { onConflict: "id" });

    if (settingsSaveError) {
      setSettingsError(settingsSaveError.message);
      return;
    }

    setSettingsSaved("Configuracion guardada.");
  };

  const openCreateModal = () => {
    setError(null);
    setCreateForm({ ...emptyProductForm });
    setIsCreateOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateOpen(false);
  };

  const startEdit = (product: Product) => {
    setError(null);
    setEditingId(product.id);
    setEditForm({
      title: product.title,
      description: product.description,
      brand: product.brand,
      compatibleBrands: product.compatible_brands,
      price: formatArsInput(String(product.price)),
      image: product.image || ""
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ ...emptyProductForm });
  };

  const handleCreate = async () => {
    setError(null);
    if (!isEditor) {
      setError("No autorizado");
      return;
    }

    if (
      !createForm.title.trim() ||
      !createForm.description.trim() ||
      !createForm.brand.trim() ||
      !createForm.compatibleBrands.trim() ||
      !createForm.price.trim()
    ) {
      setError("Completa todos los campos requeridos");
      return;
    }

    const priceValue = parseArsInput(createForm.price);
    if (priceValue <= 0) {
      setError("El precio debe ser mayor a 0");
      return;
    }

    const payload = {
      title: createForm.title.trim(),
      slug: slugify(createForm.title),
      description: createForm.description.trim(),
      brand: createForm.brand.trim(),
      compatible_brands: createForm.compatibleBrands.trim(),
      price: priceValue,
      image: createForm.image.trim() || null
    };

    const { error: insertError } = await supabase.from("products").insert(payload);
    if (insertError) {
      setError(insertError.message);
      return;
    }

    setCreateForm({ ...emptyProductForm });
    setIsCreateOpen(false);
    await loadProducts();
  };

  const handleUpdate = async (productId: string) => {
    setError(null);
    if (!isEditor) {
      setError("No autorizado");
      return;
    }

    if (
      !editForm.title.trim() ||
      !editForm.description.trim() ||
      !editForm.brand.trim() ||
      !editForm.compatibleBrands.trim() ||
      !editForm.price.trim()
    ) {
      setError("Completa todos los campos requeridos");
      return;
    }

    const priceValue = parseArsInput(editForm.price);
    if (priceValue <= 0) {
      setError("El precio debe ser mayor a 0");
      return;
    }

    const payload = {
      title: editForm.title.trim(),
      slug: slugify(editForm.title),
      description: editForm.description.trim(),
      brand: editForm.brand.trim(),
      compatible_brands: editForm.compatibleBrands.trim(),
      price: priceValue,
      image: editForm.image.trim() || null
    };

    const { error: updateError } = await supabase
      .from("products")
      .update(payload)
      .eq("id", productId);
    if (updateError) {
      setError(updateError.message);
      return;
    }

    setEditingId(null);
    setEditForm({ ...emptyProductForm });
    await loadProducts();
  };

  const handleDelete = async (productId: string) => {
    setError(null);
    if (!isEditor) {
      setError("No autorizado");
      return;
    }

    const { error: deleteError } = await supabase.from("products").delete().eq("id", productId);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setProducts((prev) => prev.filter((product) => product.id !== productId));
  };

  const canManage = useMemo(() => isEditor, [isEditor]);

  return (
    <div>
      <main className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mt-12 grid gap-8 rounded-3xl border border-black/5 bg-white/80 p-8 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">Panel de administracion</h1>
              <p className="text-sm text-muted">Roles: admin y editor</p>
            </div>
            {sessionUserId ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-black/10 px-4 py-2 text-sm"
              >
                Cerrar sesion
              </button>
            ) : null}
          </div>

          {loading ? (
            <p className="text-muted">Cargando...</p>
          ) : !sessionUserId ? (
            <form onSubmit={handleLogin} className="grid gap-4 md:max-w-md">
              <label className="grid gap-2 text-sm">
                Email
                <input
                  name="email"
                  type="email"
                  required
                  className="rounded-xl border border-black/10 px-3 py-2"
                />
              </label>
              <label className="grid gap-2 text-sm">
                Password
                <input
                  name="password"
                  type="password"
                  required
                  className="rounded-xl border border-black/10 px-3 py-2"
                />
              </label>
              <button type="submit" className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white">
                Ingresar
              </button>
              <button
                type="button"
                onClick={handleSignUp}
                className="rounded-full border border-black/10 px-5 py-2 text-sm"
              >
                Crear cuenta editor
              </button>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
            </form>
          ) : profileLoading ? (
            <p className="text-muted">Verificando perfil...</p>
          ) : profile ? (
            <div className="grid gap-6">
              <div className="rounded-2xl border border-black/5 bg-white p-4">
                <p className="text-sm text-muted">Rol actual</p>
                <p className="text-lg font-semibold">{profile.role}</p>
              </div>

              {isAdmin ? (
                <div className="rounded-2xl border border-black/5 bg-white/90 p-6 shadow-soft">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold">Contacto y redes</h2>
                      <p className="text-sm text-muted">
                        Configura WhatsApp y los links de redes sociales.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={loadSettings}
                      className="rounded-full border border-black/10 px-4 py-2 text-sm"
                    >
                      Actualizar
                    </button>
                  </div>

                  {settingsLoading ? (
                    <p className="mt-4 text-sm text-muted">Cargando configuracion...</p>
                  ) : (
                    <div className="mt-4 grid gap-4">
                      <div className="grid gap-2">
                        <p className="text-xs uppercase tracking-[0.3em] text-muted">WhatsApp</p>
                        <input
                          placeholder="Numero WhatsApp (ej: +54 9 11 1234-5678)"
                          value={settingsNumber}
                          onChange={(event) => setSettingsNumber(event.target.value)}
                          className="rounded-xl border border-black/10 px-3 py-2"
                        />
                        <input
                          type="email"
                          placeholder="Email de contacto (ej: ventas@tuempresa.com)"
                          value={settingsEmail}
                          onChange={(event) => setSettingsEmail(event.target.value)}
                          className="rounded-xl border border-black/10 px-3 py-2"
                        />
                      </div>

                      <div className="grid gap-2">
                        <p className="text-xs uppercase tracking-[0.3em] text-muted">Redes sociales</p>
                        <div className="grid gap-3 md:grid-cols-2">
                          <input
                            placeholder="Instagram URL"
                            value={settingsSocials.instagramUrl}
                            onChange={(event) =>
                              setSettingsSocials({
                                ...settingsSocials,
                                instagramUrl: event.target.value
                              })
                            }
                            className="rounded-xl border border-black/10 px-3 py-2"
                          />
                          <input
                            placeholder="Facebook URL"
                            value={settingsSocials.facebookUrl}
                            onChange={(event) =>
                              setSettingsSocials({
                                ...settingsSocials,
                                facebookUrl: event.target.value
                              })
                            }
                            className="rounded-xl border border-black/10 px-3 py-2"
                          />
                          <input
                            placeholder="TikTok URL"
                            value={settingsSocials.tiktokUrl}
                            onChange={(event) =>
                              setSettingsSocials({
                                ...settingsSocials,
                                tiktokUrl: event.target.value
                              })
                            }
                            className="rounded-xl border border-black/10 px-3 py-2"
                          />
                          <input
                            placeholder="YouTube URL"
                            value={settingsSocials.youtubeUrl}
                            onChange={(event) =>
                              setSettingsSocials({
                                ...settingsSocials,
                                youtubeUrl: event.target.value
                              })
                            }
                            className="rounded-xl border border-black/10 px-3 py-2"
                          />
                          <input
                            placeholder="X / Twitter URL"
                            value={settingsSocials.xUrl}
                            onChange={(event) =>
                              setSettingsSocials({
                                ...settingsSocials,
                                xUrl: event.target.value
                              })
                            }
                            className="rounded-xl border border-black/10 px-3 py-2"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleSaveSettings}
                          className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white"
                        >
                          Guardar configuracion
                        </button>
                      </div>
                    </div>
                  )}

                  {settingsError ? (
                    <p className="mt-3 text-sm text-red-600">{settingsError}</p>
                  ) : null}
                  {settingsSaved ? (
                    <p className="mt-3 text-sm text-emerald-600">{settingsSaved}</p>
                  ) : null}
                </div>
              ) : null}

              <div className="rounded-2xl border border-black/5 bg-white/90 p-6 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">Productos cargados</h2>
                    <p className="text-sm text-muted">
                      Administra el catalogo desde una tabla editable.
                    </p>
                  </div>
                  {canManage ? (
                    <button
                      type="button"
                      onClick={openCreateModal}
                      className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white"
                    >
                      Cargar producto
                    </button>
                  ) : null}
                </div>

                {!canManage ? (
                  <p className="mt-4 text-sm text-muted">Necesitas rol editor o admin.</p>
                ) : (
                  <>
                    {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full min-w-[920px] border-separate border-spacing-y-3 text-left text-sm">
                        <thead className="text-xs uppercase tracking-[0.22em] text-muted">
                          <tr>
                            <th className="px-4 py-2">Producto</th>
                            <th className="px-4 py-2">Marca</th>
                            <th className="px-4 py-2">Compatibles</th>
                            <th className="px-4 py-2">Precio</th>
                            <th className="px-4 py-2">Imagen</th>
                            <th className="px-4 py-2 text-right">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.length === 0 ? (
                            <tr>
                              <td
                                colSpan={6}
                                className="rounded-2xl border border-black/5 bg-white px-4 py-6 text-center text-sm text-muted"
                              >
                                Aun no hay productos.
                              </td>
                            </tr>
                          ) : (
                            products.map((product) => {
                              const isEditing = editingId === product.id;
                              return (
                                <tr key={product.id} className="align-top text-ink">
                                  <td className="rounded-l-2xl border-y border-l border-black/5 bg-white px-4 py-4">
                                    {isEditing ? (
                                      <div className="grid gap-2">
                                        <input
                                          value={editForm.title}
                                          onChange={(event) =>
                                            setEditForm({ ...editForm, title: event.target.value })
                                          }
                                          className="rounded-xl border border-black/10 px-3 py-2"
                                        />
                                        <textarea
                                          value={editForm.description}
                                          onChange={(event) =>
                                            setEditForm({
                                              ...editForm,
                                              description: event.target.value
                                            })
                                          }
                                          className="min-h-[90px] rounded-xl border border-black/10 px-3 py-2"
                                        />
                                      </div>
                                    ) : (
                                      <div>
                                        <p className="text-base font-semibold">{product.title}</p>
                                        <p className="mt-2 text-xs text-muted">
                                          {product.description}
                                        </p>
                                      </div>
                                    )}
                                  </td>
                                  <td className="border-y border-black/5 bg-white px-4 py-4">
                                    {isEditing ? (
                                      <input
                                        value={editForm.brand}
                                        onChange={(event) =>
                                          setEditForm({ ...editForm, brand: event.target.value })
                                        }
                                        className="rounded-xl border border-black/10 px-3 py-2"
                                      />
                                    ) : (
                                      <p className="font-medium">{product.brand}</p>
                                    )}
                                  </td>
                                  <td className="border-y border-black/5 bg-white px-4 py-4">
                                    {isEditing ? (
                                      <input
                                        value={editForm.compatibleBrands}
                                        onChange={(event) =>
                                          setEditForm({
                                            ...editForm,
                                            compatibleBrands: event.target.value
                                          })
                                        }
                                        className="rounded-xl border border-black/10 px-3 py-2"
                                      />
                                    ) : (
                                      <p className="text-sm text-muted">
                                        {product.compatible_brands}
                                      </p>
                                    )}
                                  </td>
                                  <td className="border-y border-black/5 bg-white px-4 py-4">
                                    {isEditing ? (
                                      <input
                                        value={editForm.price}
                                        onChange={(event) =>
                                          setEditForm({
                                            ...editForm,
                                            price: formatArsInput(event.target.value)
                                          })
                                        }
                                        className="rounded-xl border border-black/10 px-3 py-2"
                                      />
                                    ) : (
                                      <p className="font-semibold">{formatPrice(product.price)}</p>
                                    )}
                                  </td>
                                  <td className="border-y border-black/5 bg-white px-4 py-4">
                                    {isEditing ? (
                                      <div className="grid gap-2">
                                        <input
                                          value={editForm.image}
                                          onChange={(event) =>
                                            setEditForm({ ...editForm, image: event.target.value })
                                          }
                                          className="rounded-xl border border-black/10 px-3 py-2"
                                        />
                                        {editForm.image ? (
                                          <img
                                            src={editForm.image}
                                            alt={editForm.title}
                                            className="h-16 w-24 rounded-xl border border-black/10 object-cover"
                                          />
                                        ) : null}
                                      </div>
                                    ) : product.image ? (
                                      <img
                                        src={product.image}
                                        alt={product.title}
                                        className="h-16 w-24 rounded-xl border border-black/10 object-cover"
                                      />
                                    ) : (
                                      <span className="text-xs text-muted">Sin imagen</span>
                                    )}
                                  </td>
                                  <td className="rounded-r-2xl border-y border-r border-black/5 bg-white px-4 py-4">
                                    {isEditing ? (
                                      <div className="flex flex-col items-end gap-2">
                                        <button
                                          type="button"
                                          onClick={() => handleUpdate(product.id)}
                                          className="rounded-full bg-accent px-4 py-2 text-xs font-semibold text-white"
                                        >
                                          Guardar
                                        </button>
                                        <button
                                          type="button"
                                          onClick={cancelEdit}
                                          className="rounded-full border border-black/10 px-4 py-2 text-xs"
                                        >
                                          Cancelar
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="flex flex-col items-end gap-2">
                                        <button
                                          type="button"
                                          onClick={() => startEdit(product)}
                                          className="rounded-full border border-black/10 px-4 py-2 text-xs"
                                        >
                                          Editar
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDelete(product.id)}
                                          className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs text-red-600"
                                        >
                                          Borrar
                                        </button>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>

              {isCreateOpen ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-10 backdrop-blur-sm">
                  <div className="w-full max-w-2xl rounded-3xl border border-black/10 bg-white p-6 shadow-soft">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold">Nuevo producto</h3>
                        <p className="text-sm text-muted">Completa los datos del item.</p>
                      </div>
                      <button
                        type="button"
                        onClick={closeCreateModal}
                        className="rounded-full border border-black/10 px-4 py-2 text-sm"
                      >
                        Cerrar
                      </button>
                    </div>
                    <div className="mt-4 grid gap-3">
                      <input
                        placeholder="Titulo"
                        value={createForm.title}
                        onChange={(event) =>
                          setCreateForm({ ...createForm, title: event.target.value })
                        }
                        className="rounded-xl border border-black/10 px-3 py-2"
                      />
                      <input
                        placeholder="Marca"
                        value={createForm.brand}
                        onChange={(event) =>
                          setCreateForm({ ...createForm, brand: event.target.value })
                        }
                        className="rounded-xl border border-black/10 px-3 py-2"
                      />
                      <textarea
                        placeholder="Descripcion"
                        value={createForm.description}
                        onChange={(event) =>
                          setCreateForm({ ...createForm, description: event.target.value })
                        }
                        className="min-h-[120px] rounded-xl border border-black/10 px-3 py-2"
                      />
                      <input
                        placeholder="Marcas compatibles"
                        value={createForm.compatibleBrands}
                        onChange={(event) =>
                          setCreateForm({
                            ...createForm,
                            compatibleBrands: event.target.value
                          })
                        }
                        className="rounded-xl border border-black/10 px-3 py-2"
                      />
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Precio (ARS)"
                        value={createForm.price}
                        onChange={(event) =>
                          setCreateForm({
                            ...createForm,
                            price: formatArsInput(event.target.value)
                          })
                        }
                        className="rounded-xl border border-black/10 px-3 py-2"
                      />
                      <input
                        placeholder="URL imagen"
                        value={createForm.image}
                        onChange={(event) =>
                          setCreateForm({ ...createForm, image: event.target.value })
                        }
                        className="rounded-xl border border-black/10 px-3 py-2"
                      />
                    </div>
                    {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
                    <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={closeCreateModal}
                        className="rounded-full border border-black/10 px-4 py-2 text-sm"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleCreate}
                        className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white"
                      >
                        Guardar producto
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="rounded-2xl border border-black/5 bg-white p-4 text-sm text-muted">
              Tu perfil no esta asignado. Configura el rol en Supabase.
              {profileError ? (
                <p className="mt-2 text-xs text-red-600">Error: {profileError}</p>
              ) : null}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
