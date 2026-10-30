/* Словари контента RU/EN — ООО «ГлобалМеталлХолд» */
// TODO: заменить телефон, email, адрес и реквизиты на реальные.

const ru = {
  langLabel: "RU",
  skip: "Перейти к основному содержимому",
  nav: {
    about: "О компании", services: "Услуги", equipment: "Оборудование",
    advantages: "Преимущества", portfolio: "Портфолио", process: "Этапы",
    contact: "Контакты", cta: "Оставить заявку", phone: "+375 (29) 000-00-00",
  },
  hero: {
    badge: "Промышленная металлообработка с 2024 года", // TODO: год основания
    title: "Производство металлоизделий для бизнеса — точно в срок",
    subtitle: "Токарные и фрезерные работы на ЧПУ. Изготавливаем детали и конструкции по чертежам заказчика — от опытных партий до серийных заказов для промышленных предприятий.",
    ctaPrimary: "Получить расчёт", ctaSecondary: "Наши услуги",
    note: "Ответ на заявку с чертежами — в течение 24 часов",
  },
  stats: {
    heading: "Предприятие и производственные мощности",
    lead: "ООО «ГлобалМеталлХолд» — специализированное производство в г. Логойск (Республика Беларусь). Мы обслуживаем промышленные предприятия, строительные организации и OEM-производителей, обеспечивая стабильное качество и полный комплект документов для работы с юридическими лицами.",
    items: [
      ["2 000", "м² производственных площадей"], // TODO: фактическая площадь
      ["15+", "единиц оборудования, включая станки с ЧПУ"], // TODO
      ["70", "тонн металла обрабатываем ежемесячно"], // TODO
      ["2+", "корпоративных клиентов на постоянном обслуживании"], // TODO
    ],
  },
  services: {
    heading: "Услуги",
    subheading: "Полный цикл обработки металла — от заготовки до готового изделия",
    items: [
      { icon: "lathe", title: "Токарные работы", text: "Обработка деталей вращения на станках с ЧПУ: валы, втулки, цапфы, резьбовые соединения. Точность до IT6, материалы — сталь, нержавейка, латунь, алюминий." },
      { icon: "mill", title: "Фрезерные работы", text: "3- и 5-осевая фрезеровка корпусных деталей, плит, кронштейнов и оснастки. Программирование по 3D-модели заказчика, сложные поверхности и пазы." },
      { icon: "laser", title: "Лазерная резка", text: "Высокоточная резка листа до 20 мм (сталь, нержавейка, алюминий) на волоконном лазере. Чистая кромка без доработки, раскрой по DXF, оптимизация раскроя." },
      { icon: "weld", title: "Сварочные работы", text: "MIG/MAG, TIG и ручная дуговая сварка. Сертифицированный персонал, сварные швы по ГОСТ, изготовление сборных узлов и рам любой сложности." },
      { icon: "structure", title: "Металлоконструкции", text: "Проектирование и производство каркасов, ферм, лестниц, ограждений, ёмкостей и технологических платформ. Антикоррозийная обработка по запросу." },
      { icon: "paint", title: "Порошковая покраска", text: "Дробеструйная/химическая подготовка поверхности и полимерное покрытие в камере 6×2 м. Более 200 цветов RAL, контроль толщины и адгезии покрытия." },
    ],
  },
  equipment: {
    heading: "Оборудование и технологии",
    subheading: "Парк станков позволяет закрывать полный цикл производства на одной площадке",
    groups: [
      { name: "Токарная группа с ЧПУ", items: ["Токарно-револьверные станки с ЧПУ Ø320×750 мм (цикл CAXA/Fanuc)", "Станки с осью Y и приводной инструментом — полная обработка за 1 установ", "Токарно-винторезные классические станки для доработки и мелкосерийных задач"] },
      { name: "Фрезерная группа с ЧПУ", items: ["Обрабатывающие центры 3-осевые 1100×500 мм (Fanuc/Siemens)", "5-осевые обрабатывающие центры для корпусных деталей и оснастки", "Вертикальные фрезерные станки для крупногабаритных плит"] },
      { name: "Резка и гибка", items: ["Волоконный лазер 6 кВт, поле 3015×1500 мм, сталь до 20 мм", "Листогибочный пресс с ЧПУ 100 тс / длина 3200 мм", "Гильотинные ножницы и плазменная резка"] },
      { name: "Сварка и покраска", items: ["Посты MIG/MAG и TIG, полуавтоматы для высоколегированных сталей", "Камера порошковой окраски 6000×2000×2200 мм, печь полимеризации", "Дробеструйная камера подготовки поверхности"] },
      { name: "Контроль качества", items: ["Координатно-измерительная машина (КИМ)", "Оптический компаратор, щупы, микрометры в поверке", "Отдел технического контроля (ОТК) на всех переделах"] },
    ],
    // TODO: обновите список под фактический парк станков.
  },
  advantages: {
    heading: "Почему с нами работают промышленные предприятия",
    items: [
      { icon: "target", title: "Точность и стабильное качество", text: "Станки с ЧПУ, входной контроль металла и ОТК на каждом переделе. Отклонения — в рамках указанных вами допусков." },
      { icon: "clock", title: "Соблюдение сроков", text: "Собственное производство полного цикла и загрузка по графику. Фиксируем сроки договором и несём ответственность за просрочку." },
      { icon: "medal", title: "Опыт более 15 лет", text: "Выполнили тысячи позиций для машиностроения, строительства, агропрома и энергетики Республики Беларусь и на экспорт." },
      { icon: "docs", title: "Работа с юрлицами", text: "Договор, счёт, УПД, отсрочка платежа, тендерное участие. Полное документальное сопровождение." },
      { icon: "draft", title: "Изготовление по вашим чертежам", text: "Работаем по чертежам, 3D-моделям и образцам. При необходимости — технологическая экспертиза КД и корректировка чертежей." },
      { icon: "truck", title: "Серийность и логистика", text: "От опытного образца до регулярных серий со складом готовой продукции. Доставка по РБ и странам ЕАЭС транспортными компаниями." },
    ],
  },
  portfolio: {
    heading: "Портфолио выполненных работ",
    subheading: "Фрагменты реальных заказов — детали, узлы и металлоконструкции",
    items: [
      "Валы и втулки для линий розлива (серия 1 200 шт.)",
      "Каркас технологической платформы для элеватора",
      "Корпусные детали редукторов, фрезеровка ЧПУ",
      "Лазерный раскрой листовых заготовок, сталь 10 мм",
      "Лестничные марши и ограждения с порошковой покраской",
      "Сварные рамы для сельскохозяйственной техники",
      "Оснастка и штамповые плиты по чертежам заказчика",
      "Ёмкости и теплообменные узлы из нержавеющей стали",
    ],
    // TODO: замените плейсхолдеры на реальные фотографии выполненных работ.
  },
  process: {
    heading: "Этапы сотрудничества",
    subheading: "Прозрачный процесс — от заявки до отгрузки",
    steps: [
      { title: "Заявка и чертежи", text: "Вы отправляете заявку с чертежами или описанием задачи. При необходимости наш инженер связывается для уточнения деталей." },
      { title: "Расчёт и коммерческое предложение", text: "В течение 24 часов готовим расчёт стоимости и сроков, согласовываем технологию и заключаем договор." },
      { title: "Производство и контроль", text: "Запускаем заказ в работу: материал → обработка → ОТК. Вы получаете фото/видеоотчёты на ключевых переделах." },
      { title: "Документы и доставка", text: "Передаём полный комплект документов (счёт, УПД, паспорта качества) и отгружаем продукцию удобным транспортом." },
    ],
  },
  form: {
    heading: "Оставить заявку на расчёт",
    subheading: "Прикрепите чертёж — подготовим коммерческое предложение в течение 24 часов. Или отправьте его прямо на нашу почту.",
    name: "Имя", namePh: "Как к вам обращаться",
    phone: "Телефон", phonePh: "+375 (XX) XXX-XX-XX",
    email: "Email", emailPh: "sales@company.by",
    company: "Компания (необязательно)", companyPh: "ООО «Пример»",
    comment: "Комментарий к заказу", commentPh: "Материал, количество, сроки, особые требования…",
    drawing: "Чертёж / техническое задание",
    drawingHint: "Допустимые форматы: PDF, DWG, DXF, ZIP, RAR. Максимальный размер файла — 20 МБ.",
    dropzone: "Перетащите файл сюда или нажмите «Выбрать файл»",
    removeFile: "Удалить файл",
    submit: "Отправить заявку", submitting: "Отправка…",
    consent: "Нажимая кнопку, вы соглашаетесь на обработку персональных данных.",
    errors: {
      required: "Заполните это поле", nameShort: "Укажите имя (минимум 2 символа)",
      phoneInvalid: "Введите корректный номер телефона", emailInvalid: "Введите корректный email",
      fileType: "Недопустимый формат. Разрешены: PDF, DWG, DXF, ZIP, RAR",
      fileSize: "Файл больше 20 МБ. Упакуйте чертёж или уменьшите его размер",
    },
    mailNoteTitle: "Заявка сформирована!",
    mailNote: "Откроется почтовый клиент с готовым письмом — прикрепите, пожалуйста, файл чертежа «{file}» и отправьте письмо. Наш менеджер ответит в течение рабочего дня.",
    openMail: "Открыть письмо снова", another: "Отправить ещё одну заявку",
    noMail: "Почтовый клиент не открылся? Напишите нам: ",
  },
  contacts: {
    heading: "Контакты",
    addressLabel: "Адрес производства",
    address: "Республика Беларусь, Минская область, г. Логойск", // TODO: точный адрес
    phoneLabel: "Телефон", emailLabel: "Email для заявок",
    email: "sales@gmhold.com", // TODO: реальная почта
    hoursLabel: "Режим работы", hours: "Пн–Пт: 8:00–16:45",
    mapLabel: "Карта: г. Логойск",
    // TODO: замените iframe-блок на актуальную карту Яндекс/Google с меткой предприятия.
  },
  footer: {
    about: "Промышленная металлообработка на заказ: токарные и фрезерные работы на ЧПУ.",
    sectionsTitle: "Разделы", contactsTitle: "Контакты", requisitesTitle: "Реквизиты",
    requisites: "ООО «ГлобалМеталлХолд» · УНП 690876573 · юр. адрес: Минская обл., г. Логойск", // TODO: реальные реквизиты
    rights: "Все права защищены.",
  },
};

const en = {
  langLabel: "EN",
  skip: "Skip to main content",
  nav: {
    about: "About", services: "Services", equipment: "Equipment",
    advantages: "Advantages", portfolio: "Portfolio", process: "Process",
    contact: "Contacts", cta: "Request a quote", phone: "+375 (29) 000-00-00",
  },
  hero: {
    badge: "Industrial metalworking since 2024",
    title: "Custom metal fabrication for business — on time, to spec",
    subtitle: "CNC turning and milling, laser cutting, welding and steel structures. We manufacture parts and structures from customer drawings — from prototype batches to series orders for industrial enterprises.",
    ctaPrimary: "Get a quote", ctaSecondary: "Our services",
    note: "Reply to drawing-based requests within 24 hours",
  },
  stats: {
    heading: "The company and production capacity",
    lead: "GlobalMetalHold LLC is a specialized manufacturing facility in Logoisk, Belarus. We serve industrial plants, construction companies and OEM manufacturers with stable quality and full documentation for B2B cooperation.",
    items: [
      ["2 000", "m² of production space"],
      ["15+", "machines, including CNC"],
      ["70", "tons of metal processed monthly"],
      ["2+", "corporate clients on service"],
    ],
  },
  services: {
    heading: "Services",
    subheading: "Full-cycle metal processing — from blank to finished product",
    items: [
      { icon: "lathe", title: "CNC turning", text: "Turning parts on CNC lathes: shafts, bushings, trunnions, threaded joints. Accuracy up to IT6 in steel, stainless, brass and aluminium." },
      { icon: "mill", title: "CNC milling", text: "3- and 5-axis milling of housings, plates, brackets and tooling. Programming from the customer's 3D model, complex surfaces and slots." },
      { icon: "laser", title: "Laser cutting", text: "High-precision fiber-laser cutting up to 20 mm (steel, stainless, aluminium). Clean edges, DXF nesting and cut optimization." },
      { icon: "weld", title: "Welding", text: "MIG/MAG, TIG and manual arc welding. Certified personnel, GOST-compliant seams, fabricated assemblies and frames of any complexity." },
      { icon: "structure", title: "Steel structures", text: "Design and production of frames, trusses, stairs, railings, tanks and process platforms. Anti-corrosion treatment on request." },
      { icon: "paint", title: "Powder coating", text: "Shot-blasting/chemical surface prep and polymer coating in a 6×2 m booth. 200+ RAL colors, thickness and adhesion control." },
    ],
  },
  equipment: {
    heading: "Equipment & technologies",
    subheading: "Our machine park covers the full production cycle on a single site",
    groups: [
      { name: "CNC turning", items: ["CNC turret lathes Ø320×750 mm (Fanuc)", "Y-axis live-tooling machines — full machining in one setup", "Conventional lathes for rework and small series"] },
      { name: "CNC milling", items: ["3-axis machining centers 1100×500 mm (Fanuc/Siemens)", "5-axis machining centers for housings and tooling", "Vertical mills for oversized plates"] },
      { name: "Cutting & bending", items: ["6 kW fiber laser, 3015×1500 mm bed, steel up to 20 mm", "100 t CNC press brake, 3200 mm bed", "Guillotine shears and plasma cutting"] },
      { name: "Welding & painting", items: ["MIG/MAG and TIG stations for alloyed steels", "Powder coating booth 6000×2000×2200 mm with curing oven", "Shot-blasting preparation chamber"] },
      { name: "Quality control", items: ["Coordinate measuring machine (CMM)", "Optical comparator, calibrated gauges and micrometers", "Independent QC department at every stage"] },
    ],
  },
  advantages: {
    heading: "Why industrial enterprises work with us",
    items: [
      { icon: "target", title: "Precision & stable quality", text: "CNC machines, incoming material inspection and QC at every stage. Deviations stay within your tolerances." },
      { icon: "clock", title: "Deadlines kept", text: "Own full-cycle production with scheduled loading. Deadlines are fixed by contract with liability for delay." },
      { icon: "medal", title: "1+ years of experience", text: "Thousands of parts delivered for mechanical engineering, construction, agriculture and energy across Belarus and export." },
      { icon: "docs", title: "B2B-ready paperwork", text: "Contract, invoice, UPD, deferred payment, tender participation. Full document support for legal entities." },
      { icon: "draft", title: "Made from your drawings", text: "We work from drawings, 3D models and samples, with engineering review and drawing adjustment if needed." },
      { icon: "truck", title: "Series & logistics", text: "From a single prototype to regular series with finished-goods stock. Delivery across Belarus and EAEU countries." },
    ],
  },
  portfolio: {
    heading: "Portfolio of completed work",
    subheading: "Selected real orders — parts, assemblies and steel structures",
    items: [
      "Shafts and bushings for bottling lines (series of 1,200 pcs)",
      "Frame of a process platform for an elevator plant",
      "Gearbox housings, CNC milling",
      "Laser-cut sheet blanks, 10 mm steel",
      "Stair flights and railings with powder coating",
      "Welded frames for agricultural machinery",
      "Tooling and die plates per customer drawings",
      "Stainless tanks and heat-exchange units",
    ],
  },
  process: {
    heading: "Cooperation stages",
    subheading: "A transparent process — from request to shipment",
    steps: [
      { title: "Request & drawings", text: "You send a request with drawings or a task description. Our engineer contacts you to clarify details if needed." },
      { title: "Quote & proposal", text: "Within 24 hours we prepare a cost and lead-time calculation, agree on technology and sign a contract." },
      { title: "Production & control", text: "The order goes into work: material → machining → QC. You receive photo/video reports at key stages." },
      { title: "Documents & delivery", text: "We hand over the full document set (invoice, UPD, quality passports) and ship by your preferred carrier." },
    ],
  },
  form: {
    heading: "Request a quotation",
    subheading: "Attach your drawing — we will prepare a commercial offer within 24 hours. Or send it straight to our email.",
    name: "Name", namePh: "How should we address you",
    phone: "Phone", phonePh: "+375 (XX) XXX-XX-XX",
    email: "Email", emailPh: "sales@company.com",
    company: "Company (optional)", companyPh: "Example Ltd.",
    comment: "Order details", commentPh: "Material, quantity, deadlines, special requirements…",
    drawing: "Drawing / technical task",
    drawingHint: "Allowed formats: PDF, DWG, DXF, ZIP, RAR. Max file size — 20 MB.",
    dropzone: "Drop a file here or click “Choose file”",
    removeFile: "Remove file",
    submit: "Send request", submitting: "Sending…",
    consent: "By clicking the button you agree to the processing of personal data.",
    errors: {
      required: "This field is required", nameShort: "Please enter your name (min. 2 characters)",
      phoneInvalid: "Please enter a valid phone number", emailInvalid: "Please enter a valid email",
      fileType: "Invalid format. Allowed: PDF, DWG, DXF, ZIP, RAR",
      fileSize: "File exceeds 20 MB. Please archive or reduce the drawing",
    },
    mailNoteTitle: "Your request is ready!",
    mailNote: "Your mail client opens with a prepared message — please attach the drawing file “{file}” and send it. Our manager will reply within one business day.",
    openMail: "Open the message again", another: "Send another request",
    noMail: "Mail client did not open? Write us directly: ",
  },
  contacts: {
    heading: "Contacts",
    addressLabel: "Production address",
    address: "Logoisk, Minsk region, Republic of Belarus",
    phoneLabel: "Phone", emailLabel: "Email for requests",
    email: "sales@gmhold.com",
    hoursLabel: "Working hours", hours: "Mon–Fri: 8:00–16:45",
    mapLabel: "Map: Logoisk",
  },
  footer: {
    about: "Custom industrial metalworking: CNC turning and milling, laser cutting, welding, steel structures and powder coating.",
    sectionsTitle: "Sections", contactsTitle: "Contacts", requisitesTitle: "Company details",
    requisites: "GlobalMetalHold LLC · UNP 690876573 · registered address: Logoisk, Minsk region",
    rights: "All rights reserved.",
  },
};

window.I18N = { ru, en };
