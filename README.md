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


# Проверка UTM меток
При передаче параметров скрипт выбирает параметры из строки запроса и добавляет их в форму отправки.
1. utm_medium
2. utm_source
3. utm_campaign
4. utm_term
5. utm_content
6. source
7. placement
8. cusmark
9. cusmodel
10. cusyear

Пример запроса

https://localhost:44305?utm_source=google&utm_medium=cpc&utm_campaign=statya_pro_utm_metki&utm_term=utmterms&utm_content=utm_content&source=source&placement=placement&cusmark=cusmark&cusmodel=cusmodel&cusyear=cusyear
