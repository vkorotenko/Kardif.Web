# Kardif.Web
Обработчик отправки почты


# История изменений

1. Восстановлен код методом реверс инженеринга.
2. Исправлено поведение при выборе телефона во 2 форме.




# Обработка полей программой


Логика обработчика: 

1. Считать шаблон сообщения из файла **templates\mail.html**
2. Перебрать все отправленные поля из формы аттрибут **name** элемента **input**
3. Переписать строки **\<!--** и **-->**  пустой строкой, и переписать {{Имя_поля}} его значением.
4. Отправить по электронной почте

# Настройки программы

В файле web.config Изменяются следующие строки

1. TemplatePath - путь к шаблону. значение по умолчанию  ~/templates/mail.html
2. SmtpServer - почтовый сервер. Значение по умолчанию outlook.dtln.ru
3. Port - порт почтового сервера. Значение по умолчанию 587
4. EnableSsl - Использовать Ssl. Значение по умолчанию  **True** | False
5. MailFrom - почта отправителя **warranty@cardif.ru**
6. Password - пароль отправителя **Xdc3xn!n3Fl**
    
7. MailTo - почтовый ящик получатель. **warranty@cardifrussia.ru**
8. Caption - заголовок **КАРДИФ**
9. IsBodyHtml - отправлять тело письма как HTML. Значение по умолчанию  **True** | False
