from django.db import models

class YearlyRecord(models.Model):
    year   = models.IntegerField()
    births = models.IntegerField()
    deaths = models.IntegerField()
    clinic = models.CharField(max_length=20)

    class Meta:
        ordering = ["clinic", "year"]

    def __str__(self):
        return f"{self.clinic} – {self.year}"

    @property
    def proportion_deaths(self):
        return round(self.deaths / self.births, 6) if self.births else 0


class MonthlyRecord(models.Model):
    date   = models.DateField()   # first day of the reported month, e.g. 1841-01-01
    births = models.IntegerField()
    deaths = models.IntegerField()

    HANDWASHING_START = "1847-06-01"

    class Meta:
        ordering = ["date"]

    def __str__(self):
        return str(self.date)

    @property
    def proportion_deaths(self):
        return round(self.deaths / self.births, 6) if self.births else 0

    @property
    def after_handwashing(self):
        from datetime import date
        pivot = date(1847, 6, 1)
        return self.date >= pivot