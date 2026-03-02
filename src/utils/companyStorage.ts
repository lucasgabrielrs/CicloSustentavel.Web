export interface CompanyData {
  id: string
  name: string
  cnpj?: string
  segment?: string
  phone?: string
  address?: string
}

const COMPANIES_KEY = 'companies'
const ACTIVE_COMPANY_ID_KEY = 'activeCompanyId'

function safeParseCompanies(raw: string | null): CompanyData[] {
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed)) return []

    return parsed
      .map<CompanyData | null>((company, index) => {
        const id = String(company?.id ?? '').trim()
        const name = String(company?.name ?? '').trim() || `Empresa ${index + 1}`

        if (!id) return null

        return {
          id,
          name,
          cnpj: String(company?.cnpj ?? '').trim(),
          segment: String(company?.segment ?? '').trim(),
          phone: String(company?.phone ?? '').trim(),
          address: String(company?.address ?? '').trim(),
        } satisfies CompanyData
      })
      .filter((company): company is CompanyData => Boolean(company))
  } catch {
    return []
  }
}

function syncLegacyCompanyFields(activeCompany: CompanyData | null) {
  if (!activeCompany) {
    localStorage.removeItem('companyName')
    localStorage.removeItem('cnpj')
    localStorage.removeItem('companySegment')
    localStorage.removeItem('companyPhone')
    localStorage.removeItem('companyAddress')
    return
  }

  localStorage.setItem('companyName', activeCompany.name)

  if (activeCompany.cnpj) localStorage.setItem('cnpj', activeCompany.cnpj)
  else localStorage.removeItem('cnpj')

  if (activeCompany.segment) localStorage.setItem('companySegment', activeCompany.segment)
  else localStorage.removeItem('companySegment')

  if (activeCompany.phone) localStorage.setItem('companyPhone', activeCompany.phone)
  else localStorage.removeItem('companyPhone')

  if (activeCompany.address) localStorage.setItem('companyAddress', activeCompany.address)
  else localStorage.removeItem('companyAddress')
}

export function getStoredCompanies(): CompanyData[] {
  return safeParseCompanies(localStorage.getItem(COMPANIES_KEY))
}

export function getActiveCompanyId(): string {
  return localStorage.getItem(ACTIVE_COMPANY_ID_KEY) || ''
}

export function getActiveCompany(): CompanyData | null {
  const companies = getStoredCompanies()
  const activeId = getActiveCompanyId()
  return companies.find((company) => company.id === activeId) || null
}

export function setActiveCompany(companyId: string): boolean {
  const companies = getStoredCompanies()
  const activeCompany = companies.find((company) => company.id === companyId)

  if (!activeCompany) return false

  localStorage.setItem(ACTIVE_COMPANY_ID_KEY, activeCompany.id)
  syncLegacyCompanyFields(activeCompany)
  return true
}

export function saveCompanies(companies: CompanyData[]) {
  const sanitizedCompanies = companies
    .map((company, index) => ({
      id: String(company.id ?? '').trim(),
      name: String(company.name ?? '').trim() || `Empresa ${index + 1}`,
      cnpj: String(company.cnpj ?? '').trim(),
      segment: String(company.segment ?? '').trim(),
      phone: String(company.phone ?? '').trim(),
      address: String(company.address ?? '').trim(),
    }))
    .filter((company) => Boolean(company.id))

  localStorage.setItem(COMPANIES_KEY, JSON.stringify(sanitizedCompanies))

  if (sanitizedCompanies.length === 0) {
    localStorage.removeItem(ACTIVE_COMPANY_ID_KEY)
    syncLegacyCompanyFields(null)
    return
  }

  const currentActiveId = getActiveCompanyId()
  const hasActive = sanitizedCompanies.some((company) => company.id === currentActiveId)
  const fallbackCompany = sanitizedCompanies[0]

  if (!fallbackCompany) {
    return
  }

  setActiveCompany(hasActive ? currentActiveId : fallbackCompany.id)
}

export function clearCompanyStorage() {
  localStorage.removeItem(COMPANIES_KEY)
  localStorage.removeItem(ACTIVE_COMPANY_ID_KEY)
  syncLegacyCompanyFields(null)
}

export function normalizeCompaniesFromLogin(userData: Record<string, unknown>): CompanyData[] {
  const companiesRaw = Array.isArray(userData.companies) ? userData.companies : []

  const fromObjectList = companiesRaw
    .map<CompanyData | null>((company, index) => {
      if (!company || typeof company !== 'object') return null

      const source = company as Record<string, unknown>
      const id = String(source.id ?? source.empresaId ?? '').trim()
      const name = String(source.name ?? source.nome ?? '').trim()

      if (!id) return null

      return {
        id,
        name: name || `Empresa ${index + 1}`,
        cnpj: String(source.cnpj ?? '').trim(),
        segment: String(source.segment ?? source.segmento ?? '').trim(),
        phone: String(source.phone ?? source.telefone ?? '').trim(),
        address: String(source.address ?? source.endereco ?? '').trim(),
      } satisfies CompanyData
    })
    .filter((company): company is CompanyData => Boolean(company))

  if (fromObjectList.length > 0) {
    return fromObjectList
  }

  const fallbackCompanyName = String(userData.companyName ?? '').trim()
  const fallbackCnpj = String(userData.cnpj ?? '').trim()

  if (fallbackCompanyName || fallbackCnpj) {
    return [
      {
        id: '1',
        name: fallbackCompanyName || 'Minha Empresa',
        cnpj: fallbackCnpj,
      },
    ]
  }

  return []
}
