import { useState } from "react";
import {
  Bell,
  Check,
  Globe,
  Lock,
  Mail,
  MapPin,
  Save,
  Shield,
  Store,
  User,
} from "lucide-react";

type Section =
  | "general"
  | "store"
  | "notifications"
  | "security";

const Settings = () => {
  const [activeSection, setActiveSection] =
    useState<Section>("general");

  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    storeName: "The Brand BLVD",
    storeEmail: "info@thebrandblvd.com",
    storePhone: "",
    storeAddress: "",
    currency: "USD",
    timezone: "Asia/Karachi",

    emailOrders: true,
    emailCustomers: true,
    emailLowStock: true,
    emailMarketing: false,

    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const updateSetting = (
    field: keyof typeof settings,
    value: string | boolean
  ) => {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // Later we can connect this with:
    // PUT /api/settings

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const sections = [
    {
      id: "general" as Section,
      label: "General",
      description: "Store information",
      icon: Store,
    },
    {
      id: "store" as Section,
      label: "Store",
      description: "Store preferences",
      icon: Globe,
    },
    {
      id: "notifications" as Section,
      label: "Notifications",
      description: "Alerts & emails",
      icon: Bell,
    },
    {
      id: "security" as Section,
      label: "Security",
      description: "Password & security",
      icon: Shield,
    },
  ];

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-black/40">
          Administration
        </p>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-semibold tracking-[-0.04em]">
              Settings
            </h1>

            <p className="mt-2 max-w-xl text-sm text-black/50">
              Manage your store preferences, notifications and
              account security.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="inline-flex h-11 items-center justify-center gap-2 bg-black px-5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-black/80"
          >
            {saved ? (
              <>
                <Check size={16} />
                Saved
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success notification */}
      {saved && (
        <div className="flex items-center gap-3 bg-black px-4 py-3 text-sm text-white">
          <Check size={17} />
          <span>Settings saved successfully.</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[250px_1fr]">
        {/* Settings Navigation */}
        <aside className="h-fit bg-white p-2">
          {sections.map((section) => {
            const Icon = section.icon;
            const active = activeSection === section.id;

            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition ${
                  active
                    ? "bg-black text-white"
                    : "text-black hover:bg-black/[0.04]"
                }`}
              >
                <Icon size={18} strokeWidth={1.8} />

                <div>
                  <p className="text-sm font-medium">
                    {section.label}
                  </p>

                  <p
                    className={`mt-0.5 text-[11px] ${
                      active
                        ? "text-white/55"
                        : "text-black/40"
                    }`}
                  >
                    {section.description}
                  </p>
                </div>
              </button>
            );
          })}
        </aside>

        {/* Settings Content */}
        <section className="bg-white p-5 md:p-8">
          {/* GENERAL */}
          {activeSection === "general" && (
            <div>
              <SectionHeader
                icon={Store}
                title="General Information"
                description="Basic information about your store."
              />

              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <Input
                  label="Store Name"
                  value={settings.storeName}
                  onChange={(value) =>
                    updateSetting("storeName", value)
                  }
                  icon={Store}
                />

                <Input
                  label="Store Email"
                  type="email"
                  value={settings.storeEmail}
                  onChange={(value) =>
                    updateSetting("storeEmail", value)
                  }
                  icon={Mail}
                />

                <Input
                  label="Store Phone"
                  value={settings.storePhone}
                  onChange={(value) =>
                    updateSetting("storePhone", value)
                  }
                  placeholder="+92 XXX XXXXXXX"
                  icon={User}
                />

                <Input
                  label="Store Address"
                  value={settings.storeAddress}
                  onChange={(value) =>
                    updateSetting("storeAddress", value)
                  }
                  placeholder="Your store address"
                  icon={MapPin}
                />
              </div>
            </div>
          )}

          {/* STORE */}
          {activeSection === "store" && (
            <div>
              <SectionHeader
                icon={Globe}
                title="Store Settings"
                description="Configure your store's regional preferences."
              />

              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <SelectInput
                  label="Currency"
                  value={settings.currency}
                  onChange={(value) =>
                    updateSetting("currency", value)
                  }
                  options={[
                    { label: "US Dollar (USD)", value: "USD" },
                    { label: "Pakistani Rupee (PKR)", value: "PKR" },
                    { label: "British Pound (GBP)", value: "GBP" },
                    { label: "Euro (EUR)", value: "EUR" },
                    { label: "UAE Dirham (AED)", value: "AED" },
                  ]}
                />

                <SelectInput
                  label="Timezone"
                  value={settings.timezone}
                  onChange={(value) =>
                    updateSetting("timezone", value)
                  }
                  options={[
                    {
                      label: "Pakistan — Karachi",
                      value: "Asia/Karachi",
                    },
                    {
                      label: "United States — New York",
                      value: "America/New_York",
                    },
                    {
                      label: "United States — Los Angeles",
                      value: "America/Los_Angeles",
                    },
                    {
                      label: "United Kingdom — London",
                      value: "Europe/London",
                    },
                  ]}
                />
              </div>

              <div className="mt-8 bg-[#f7f7f7] p-5">
                <p className="text-sm font-semibold">
                  Store Status
                </p>

                <p className="mt-1 text-xs text-black/45">
                  Your online store is currently active and
                  accepting orders.
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-xs font-medium">
                    Store is Online
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeSection === "notifications" && (
            <div>
              <SectionHeader
                icon={Bell}
                title="Notifications"
                description="Choose which events you want to receive notifications for."
              />

              <div className="mt-8 divide-y divide-black/[0.06]">
                <Toggle
                  title="New Orders"
                  description="Receive an email whenever a new order is placed."
                  checked={settings.emailOrders}
                  onChange={(value) =>
                    updateSetting("emailOrders", value)
                  }
                />

                <Toggle
                  title="New Customers"
                  description="Receive an email when a new customer registers."
                  checked={settings.emailCustomers}
                  onChange={(value) =>
                    updateSetting("emailCustomers", value)
                  }
                />

                <Toggle
                  title="Low Stock Alerts"
                  description="Get notified when a product reaches low stock."
                  checked={settings.emailLowStock}
                  onChange={(value) =>
                    updateSetting("emailLowStock", value)
                  }
                />

                <Toggle
                  title="Marketing Emails"
                  description="Receive promotional and marketing notifications."
                  checked={settings.emailMarketing}
                  onChange={(value) =>
                    updateSetting("emailMarketing", value)
                  }
                />
              </div>
            </div>
          )}

          {/* SECURITY */}
          {activeSection === "security" && (
            <div>
              <SectionHeader
                icon={Lock}
                title="Security"
                description="Manage your administrator account security."
              />

              <div className="mt-8 max-w-2xl space-y-5">
                <Input
                  label="Current Password"
                  type="password"
                  value={settings.currentPassword}
                  onChange={(value) =>
                    updateSetting("currentPassword", value)
                  }
                  icon={Lock}
                />

                <Input
                  label="New Password"
                  type="password"
                  value={settings.newPassword}
                  onChange={(value) =>
                    updateSetting("newPassword", value)
                  }
                  icon={Lock}
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  value={settings.confirmPassword}
                  onChange={(value) =>
                    updateSetting("confirmPassword", value)
                  }
                  icon={Lock}
                />

                <div className="pt-3">
                  <button
                    type="button"
                    className="h-11 bg-black px-5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-black/80"
                  >
                    Update Password
                  </button>
                </div>
              </div>

              <div className="mt-10 bg-[#f7f7f7] p-5">
                <div className="flex gap-3">
                  <Shield
                    size={19}
                    className="mt-0.5 shrink-0"
                  />

                  <div>
                    <p className="text-sm font-semibold">
                      Administrator Account
                    </p>

                    <p className="mt-1 text-xs leading-5 text-black/45">
                      Keep your administrator password strong and
                      never share your login credentials with anyone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

/* --------------------------------
   Reusable Components
--------------------------------- */

interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const SectionHeader = ({
  icon: Icon,
  title,
  description,
}: SectionHeaderProps) => {
  return (
    <div className="border-b border-black/[0.06] pb-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center bg-black text-white">
          <Icon size={18} />
        </div>

        <div>
          <h2 className="text-lg font-semibold tracking-[-0.02em]">
            {title}
          </h2>

          <p className="mt-1 text-xs text-black/45">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  icon?: React.ElementType;
}

const Input = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  icon: Icon,
}: InputProps) => {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-black/50">
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30"
          />
        )}

        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={`h-12 w-full bg-[#f7f7f7] text-sm outline-none transition placeholder:text-black/25 focus:bg-[#f2f2f2] ${
            Icon ? "pl-11 pr-4" : "px-4"
          }`}
        />
      </div>
    </div>
  );
};

interface SelectInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: {
    label: string;
    value: string;
  }[];
}

const SelectInput = ({
  label,
  value,
  onChange,
  options,
}: SelectInputProps) => {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-black/50">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full bg-[#f7f7f7] px-4 text-sm outline-none transition focus:bg-[#f2f2f2]"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

interface ToggleProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

const Toggle = ({
  title,
  description,
  checked,
  onChange,
}: ToggleProps) => {
  return (
    <div className="flex items-center justify-between gap-5 py-5">
      <div>
        <p className="text-sm font-medium">{title}</p>

        <p className="mt-1 text-xs leading-5 text-black/45">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-black" : "bg-black/15"
        }`}
        aria-label={title}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
};

export default Settings;